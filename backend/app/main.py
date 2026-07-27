# FastAPI app entrypoint — mounts routers from app/api, see docs/API_SPEC.md

from fastapi import FastAPI

from app.api import forms, questions

app = FastAPI()

app.include_router(forms.router, prefix="/forms")
app.include_router(questions.router)


@app.get("/")
def root():
    return {
        "message": "Backend Running"
    }