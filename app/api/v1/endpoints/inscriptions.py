from fastapi import APIRouter, HTTPException, status, Query, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

from app.core.deps import get_current_user, require_role, CurrentUser
from app.db.session import get_supabase

router = APIRouter()


class InscriptionCreate(BaseModel):
    email: EmailStr
    phone: str
    category: str
    subcategory: str
    full_name: str
    stage_name: Optional[str] = None
    dni: Optional[str] = None
    province: Optional[str] = None
    city: Optional[str] = None
    experience_years: Optional[int] = None
    bio: Optional[str] = None
    website: Optional[str] = None
    instagram: Optional[str] = None
    youtube: Optional[str] = None
    spotify: Optional[str] = None


class InscriptionResponse(BaseModel):
    id: str
    email: str
    phone: str
    category: str
    subcategory: str
    full_name: str
    stage_name: Optional[str]
    status: str
    created_at: str
    updated_at: str


class InscriptionListResponse(BaseModel):
    data: List[InscriptionResponse]
    total: int
    page: int
    page_size: int


@router.get("/", response_model=InscriptionListResponse)
async def list_inscriptions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    subcategory: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: CurrentUser = Depends(require_role("organizador", "admin", "staff")),
):
    db = get_supabase()

    query = db.table("inscriptions").select("*", count="exact")

    if category:
        query = query.eq("category", category)
    if subcategory:
        query = query.eq("subcategory", subcategory)
    if status_filter:
        query = query.eq("status", status_filter)

    offset = (page - 1) * page_size
    result = query.order("created_at", desc=True).range(offset, offset + page_size - 1).execute()

    return InscriptionListResponse(
        data=[InscriptionResponse(**item) for item in result.data],
        total=result.count or 0,
        page=page,
        page_size=page_size,
    )


@router.post("/", response_model=InscriptionResponse, status_code=status.HTTP_201_CREATED)
async def create_inscription(inscription: InscriptionCreate):
    try:
        db = get_supabase()
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Base de datos no disponible: {str(e)}",
        )

    try:
        existing = db.table("inscriptions").select("id").eq("email", inscription.email).eq("status", "PENDIENTE").execute()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error consultando inscripciones: {str(e)}",
        )
    if existing.data:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una inscripción pendiente con este email",
        )

    insert_data = {k: v for k, v in inscription.model_dump().items() if v is not None}
    insert_data["status"] = "PENDIENTE"

    try:
        result = db.table("inscriptions").insert(insert_data).execute()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear inscripción en base de datos: {str(e)}",
        )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al crear inscripción",
        )

    return InscriptionResponse(**result.data[0])


@router.get("/{inscription_id}", response_model=InscriptionResponse)
async def get_inscription(
    inscription_id: str,
    current_user: CurrentUser = Depends(get_current_user),
):
    db = get_supabase()
    result = db.table("inscriptions").select("*").eq("id", inscription_id).single().execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inscripción no encontrada",
        )

    return InscriptionResponse(**result.data)


@router.patch("/{inscription_id}/status")
async def update_inscription_status(
    inscription_id: str,
    new_status: str,
    reason: Optional[str] = None,
    current_user: CurrentUser = Depends(require_role("organizador", "admin")),
):
    valid_statuses = ["PENDIENTE", "EN_REVISION", "APROBADA", "RECHAZADA", "CONTRATO_FIRMADO"]
    if new_status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Estado inválido. Debe ser uno de: {', '.join(valid_statuses)}",
        )

    db = get_supabase()

    update_data = {
        "status": new_status,
        "updated_at": "now()",
        "updated_by": current_user.id,
    }

    if reason:
        update_data["rejection_reason"] = reason

    result = db.table("inscriptions").update(update_data).eq("id", inscription_id).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inscripción no encontrada",
        )

    db.table("inscription_audit").insert({
        "inscription_id": inscription_id,
        "action": f"status_changed_to_{new_status}",
        "from_status": result.data[0].get("status"),
        "to_status": new_status,
        "reason": reason,
        "user_id": current_user.id,
    }).execute()

    return {"message": f"Inscripción actualizada a {new_status}"}