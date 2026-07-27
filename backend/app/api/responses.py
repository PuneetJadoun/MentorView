from fastapi import APIRouter, Depends, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.response import ResponseDetail, ResponseListItem
from app.services import response_service

router = APIRouter(tags=["Responses"])


@router.get(
    "/forms/{form_id}/responses",
    response_model=list[ResponseListItem],
    status_code=status.HTTP_200_OK,
    summary="List responses for a form",
    description="Returns response id, submitted_at, and completion status for every response to a form.",
)
def list_responses(form_id: int, db: Session = Depends(get_db)) -> list[ResponseListItem]:
    return response_service.list_responses_for_form(db, form_id)


@router.get(
    "/responses/{response_id}",
    response_model=ResponseDetail,
    status_code=status.HTTP_200_OK,
    summary="Get a single response",
    description="Returns response metadata and every answer, with each question's title resolved.",
)
def get_response(response_id: int, db: Session = Depends(get_db)) -> ResponseDetail:
    return response_service.get_response_detail(db, response_id)


@router.get(
    "/forms/{form_id}/responses/export",
    status_code=status.HTTP_200_OK,
    summary="Export responses as CSV",
    description="Downloads all of a form's responses as a CSV file: one row per response, one column per question.",
)
def export_responses(form_id: int, db: Session = Depends(get_db)) -> StreamingResponse:
    csv_content = response_service.export_responses_csv(db, form_id)
    filename = f"form_{form_id}_responses.csv"
    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
