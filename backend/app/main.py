# FastAPI app entrypoint — mounts routers from app/api, see docs/API_SPEC.md

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import forms, public, questions, responses

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forms.router, prefix="/forms")
app.include_router(questions.router)
app.include_router(public.router)
app.include_router(responses.router)


@app.get("/")
def root():
    return {
        "message": "Backend Running"
    }