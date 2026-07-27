from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

QuestionType = Literal[
    "short_text",
    "long_text",
    "email",
    "number",
    "date",
    "yes_no",
    "multiple_choice",
    "checkbox",
    "dropdown",
]


class QuestionOptionCreate(BaseModel):
    """Request body for POST /questions/{question_id}/options."""

    option_text: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="Option label shown to respondents.",
    )


class QuestionOptionUpdate(BaseModel):
    """Request body for PUT /options/{option_id}."""

    option_text: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="New option label.",
    )


class QuestionOptionResponse(BaseModel):
    """Response body for a single question option, nested inside QuestionResponse."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    question_id: int
    option_text: str
    position: int


class QuestionCreate(BaseModel):
    """Request body for POST /forms/{form_id}/questions."""

    title: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="The question text shown to respondents.",
    )
    description: str | None = Field(
        default=None,
        max_length=2000,
        description="Optional help text shown below the question.",
    )
    type: QuestionType = Field(description="One of the supported question types.")
    required: bool = Field(
        default=False, description="Whether the respondent must answer this question."
    )
    position: int | None = Field(
        default=None,
        ge=1,
        description="1-based display order within the form. Appended to the end if omitted.",
    )

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("title must not be blank")
        return value


class QuestionUpdate(BaseModel):
    """Request body for PUT /questions/{question_id}.

    All fields are optional so a caller can update just the parts that
    changed. Position is deliberately excluded here — reordering has its
    own dedicated endpoint.
    """

    title: str | None = Field(default=None, min_length=1, max_length=500)
    description: str | None = Field(default=None, max_length=2000)
    type: QuestionType | None = Field(default=None)
    required: bool | None = Field(default=None)

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, value: str | None) -> str | None:
        if value is not None:
            value = value.strip()
            if not value:
                raise ValueError("title must not be blank")
        return value

    @model_validator(mode="after")
    def at_least_one_field_set(self) -> "QuestionUpdate":
        if all(v is None for v in (self.title, self.description, self.type, self.required)):
            raise ValueError("at least one field must be provided to update the question")
        return self


class QuestionResponse(BaseModel):
    """Response body for a single question, including its options (if any)."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    form_id: int
    title: str
    description: str | None
    type: QuestionType
    required: bool
    position: int
    options: list[QuestionOptionResponse] = Field(default_factory=list)


class QuestionReorderItem(BaseModel):
    """One entry in the PATCH /forms/{form_id}/questions/reorder request body."""

    question_id: int
    position: int = Field(ge=1)
