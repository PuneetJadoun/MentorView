from pydantic import BaseModel, ConfigDict, Field

from app.schemas.question import QuestionType


class PublicOptionResponse(BaseModel):
    """Public-safe option shown to respondents (no internal timestamps/ids beyond what renders)."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    option_text: str
    position: int


class PublicQuestionResponse(BaseModel):
    """Public-safe question shown one-at-a-time in the respondent flow."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    type: QuestionType
    required: bool
    position: int
    options: list[PublicOptionResponse] = Field(default_factory=list)


class PublicFormResponse(BaseModel):
    """Response body for GET /public/{share_id}.

    Deliberately excludes creator-only fields (status, share_id, timestamps) —
    only what's needed to render the public fill experience is included.
    Theme fields are kept since they're meant to be shown to respondents.
    """

    id: int
    title: str
    description: str | None
    theme_color: str | None
    background_color: str | None
    font_family: str | None
    dark_mode: bool
    questions: list[PublicQuestionResponse] = Field(default_factory=list)


class PublicAnswerSubmit(BaseModel):
    """One answer within a POST /public/{share_id}/submit request."""

    question_id: int
    answer: str = Field(description="The respondent's answer, as text.")


class PublicSubmitRequest(BaseModel):
    """Request body for POST /public/{share_id}/submit."""

    answers: list[PublicAnswerSubmit] = Field(default_factory=list)


class PublicSubmitResponse(BaseModel):
    """Response body for POST /public/{share_id}/submit."""

    response_id: int
    message: str
