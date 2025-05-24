# dwani_modules.py
import dwani
import os
from dotenv import load_dotenv

load_dotenv()
dwani.api_key = os.getenv("DWANI_API_KEY")
dwani.api_base = os.getenv("DWANI_API_BASE_URL")

def chat(prompt):
    return dwani.Chat.create(prompt=prompt, src_lang="eng_Latn", tgt_lang="kan_Knda")

def translate(text):
    return dwani.Translate.run_translate(sentences=[text], src_lang="eng_Latn", tgt_lang="kan_Knda")

def asr(file_path):
    return dwani.ASR.transcribe(file_path=file_path, language="kannada")

def tts(input_text):
    return dwani.Audio.speech(input=input_text, response_format="mp3")

def vision_caption(file_path, query):
    return dwani.Vision.caption(file_path=file_path, query=query, src_lang="eng_Latn", tgt_lang="kan_Knda")
