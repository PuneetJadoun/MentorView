from datetime import datetime

from pydantic import BaseModel


class ResponseListItem(BaseModel):
    """One item in the GET /forms/{form_id}/responses response.

    Built manually in the service layer (not via from_attributes), since the
    field is named response_id here but the ORM column is Response.id.
    """

    response_id: int
    submitted_at: datetime | None
    completed: bool


class AnswerDetail(BaseModel):
    """One answer within a GET /responses/{response_id} response, with the
    question's title resolved so the caller doesn't need a second lookup."""

    question: str
    answer: str | None


class ResponseDetail(BaseModel):
    """Response body for GET /responses/{response_id}."""

    response_id: int
    submitted_at: datetime | None
    completed: bool
    answers: list[AnswerDetail]
