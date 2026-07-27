from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class FormCreate(BaseModel):
    """Request body for POST /forms — see API_SPEC.md "Create Form"."""

    title: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Form title, shown in the creator's form list and builder header.",
    )
    description: str | None = Field(
        default=None,
        max_length=2000,
        description="Optional form description.",
    )

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("title must not be blank")
        return value


class FormUpdate(BaseModel):
    """Request body for PUT /forms/{form_id} — see API_SPEC.md "Update Form".

    Both fields are optional so a caller can update just the title, just the
    description, or both, matching the example payload in the spec.
    """

    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
        description="New form title.",
    )
    description: str | None = Field(
        default=None,
        max_length=2000,
        description="New form description.",
    )

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, value: str | None) -> str | None:
        if value is not None:
            value = value.strip()
            if not value:
                raise ValueError("title must not be blank")
        return value

    @model_validator(mode="after")
    def at_least_one_field_set(self) -> "FormUpdate":
        if self.title is None and self.description is None:
            raise ValueError("at least one of title or description must be provided")
        return self


class FormResponse(BaseModel):
    """Response body for GET /forms/{form_id} — see API_SPEC.md "Get Form".

    Built directly from the Form ORM instance (ConfigDict(from_attributes=True)),
    so field names mirror the "forms" table in DATABASE_SCHEMA.md.
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    status: Literal["draft", "published"] = Field(
        description="Matches DATABASE_SCHEMA.md: forms.status is draft or published."
    )
    share_id: str = Field(description="Public shareable identifier for the form.")


class FormListResponse(BaseModel):
    """One item in the GET /forms response — see API_SPEC.md "Get All Forms".

    Deliberately lighter than FormResponse: the list view only needs enough
    to render the creator's forms table, not the full form detail.
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    status: Literal["draft", "published"]
    updated_at: datetime
