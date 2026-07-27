from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.public import PublicFormResponse, PublicSubmitRequest, PublicSubmitResponse
from app.services import public_service

router = APIRouter(tags=["Public"])


@router.get(
    "/public/{share_id}",
    response_model=PublicFormResponse,
    status_code=status.HTTP_200_OK,
    summary="Get a published form for filling",
    description=(
        "Returns a published form's public-safe fields plus its ordered questions "
        "and options, for the no-auth respondent flow. 404 if the share_id doesn't "
        "exist or the form isn't published."
    ),
)
def get_public_form(share_id: str, db: Session = Depends(get_db)) -> PublicFormResponse:
    return public_service.get_public_form(db, share_id)


@router.post(
    "/public/{share_id}/submit",
    response_model=PublicSubmitResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit a response to a published form",
    description=(
        "Validates that every answered question_id belongs to the form and that "
        "every required question was answered, then stores a Response and its Answers."
    ),
)
def submit_response(
    share_id: str, submit_data: PublicSubmitRequest, db: Session = Depends(get_db)
) -> PublicSubmitResponse:
    return public_service.submit_response(db, share_id, submit_data)
