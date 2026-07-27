# FastAPI app entrypoint — mounts routers from app/api, see docs/API_SPEC.md

from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def root():
    return {
        "message": "Backend Running"
    }