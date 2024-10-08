import google.generativeai as genai
from IPython.display import display
from IPython.display import Markdown
from flash_chatbot import settings
from fastapi import FastAPI,HTTPException
from contextlib import asynccontextmanager
import textwrap
from pydantic import BaseModel
from google.generativeai.types.generation_types import GenerateContentResponse
import re

class Chat(BaseModel):
    prompt: str

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Fastapi app started...")
    yield

app = FastAPI(lifespan=lifespan,
              title="Ujjan AI API Service...",
              version='1.0.0'
              )
from fastapi.middleware.cors import CORSMiddleware

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this as necessary
    allow_credentials=True,
    allow_methods=["*"],  # This allows all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # This allows all headers
)

@app.get('/')
async def root():
   return{"welcome to ASK UJJAN","AI powered chatbot"}

def to_markdown(text):
    text = text.replace("•", "  *")
    return Markdown(textwrap.indent(text, "> ", predicate=lambda _: True))

API_KEY = str(settings.GEMINI_API_KEY)
genai.configure(api_key=API_KEY)

for m in genai.list_models():
    if "generateContent" in m.supported_generation_methods:
        m

model = genai.GenerativeModel("gemini-1.5-flash")
chat = model.start_chat(history=[])
chat

@app.post("/chat")
async def chatbot(Prompt: Chat):
    try:
        response: GenerateContentResponse = chat.send_message(Prompt.prompt)
        print(response.text)
          # Ensure this is correct
        return to_markdown(response.text)  # Return as a dictionary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
