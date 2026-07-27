import re
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

_HEX_COLOR_RE = re.compile(r"^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$")


def _validate_hex_color(value: str | None) -> str | None:
    if value is not None and not _HEX_COLOR_RE.match(value):
        raise ValueError("must be a hex color like #2563EB")
    return value


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
    """Request body for PUT /forms/{form_id} — see API_SPEC.md "Update Form"
    plus "Update Theme". All fields are optional so a caller can update just
    the parts that changed — title/description, theme placeholders, or the
    thank-you screen copy.
    """

    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=2000)
    theme_color: str | None = Field(
        default=None, description="Accent color as a hex string, e.g. #2563EB."
    )
    background_color: str | None = Field(
        default=None, description="Public form background color as a hex string."
    )
    font_family: str | None = Field(default=None, max_length=100)
    dark_mode: bool | None = Field(
        default=None, description="Whether the public form renders in dark mode."
    )
    thank_you_title: str | None = Field(default=None, max_length=255)
    thank_you_subtitle: str | None = Field(default=None, max_length=500)

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, value: str | None) -> str | None:
        if value is not None:
            value = value.strip()
            if not value:
                raise ValueError("title must not be blank")
        return value

    @field_validator("theme_color", "background_color")
    @classmethod
    def validate_hex_color(cls, value: str | None) -> str | None:
        return _validate_hex_color(value)

    @model_validator(mode="after")
    def at_least_one_field_set(self) -> "FormUpdate":
        fields = (
            self.title,
            self.description,
            self.theme_color,
            self.background_color,
            self.font_family,
            self.dark_mode,
            self.thank_you_title,
            self.thank_you_subtitle,
        )
        if all(v is None for v in fields):
            raise ValueError("at least one field must be provided to update the form")
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
    theme_color: str | None
    background_color: str | None
    font_family: str | None
    dark_mode: bool
    thank_you_title: str | None
    thank_you_subtitle: str | None


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
