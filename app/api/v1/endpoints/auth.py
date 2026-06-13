from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional

from app.db.session import get_supabase

router = APIRouter()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: Optional[str] = "staff"


class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    db = get_supabase()

    try:
        result = db.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password,
        })

        if not result.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales inválidas",
            )

        return LoginResponse(
            access_token=result.session.access_token,
            refresh_token=result.session.refresh_token,
            expires_in=result.session.expires_in,
        )
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e).lower()
        if "email not confirmed" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email no confirmado. Desactive la confirmación de email en Supabase Dashboard > Auth > Providers > Email.",
            )
        if "invalid login credentials" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales inválidas",
            )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Error de autenticación: {str(e)}",
        )


@router.post("/register", response_model=LoginResponse)
async def register(request: RegisterRequest):
    db = get_supabase()

    try:
        result = db.auth.sign_up({
            "email": request.email,
            "password": request.password,
            "options": {
                "data": {
                    "full_name": request.full_name,
                    "role": request.role,
                }
            }
        })

        if not result.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al crear usuario",
            )

        if result.session:
            return LoginResponse(
                access_token=result.session.access_token,
                refresh_token=result.session.refresh_token,
                expires_in=result.session.expires_in,
            )

        raise HTTPException(
            status_code=status.HTTP_201_CREATED,
            detail="Usuario creado. Verifique su email para confirmar.",
        )
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e).lower()
        if "already registered" in error_msg or "user already exists" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe un usuario con ese email",
            )
        if "rate limit" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Demasiadas solicitudes. Espere un momento.",
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error de registro: {str(e)}",
        )


@router.post("/refresh", response_model=LoginResponse)
async def refresh_token(request: RefreshRequest):
    db = get_supabase()

    try:
        result = db.auth.refresh_session(request.refresh_token)

        if not result.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token de refresco inválido",
            )

        return LoginResponse(
            access_token=result.session.access_token,
            refresh_token=result.session.refresh_token,
            expires_in=result.session.expires_in,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Error al refrescar token: {str(e)}",
        )


@router.post("/logout")
async def logout():
    db = get_supabase()
    try:
        db.auth.sign_out()
        return {"message": "Sesión cerrada correctamente"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al cerrar sesión: {str(e)}",
        )
