import os
from pathlib import Path

from dotenv import load_dotenv


AGENT_ROOT = Path(__file__).resolve().parent.parent
ENV_PATH = AGENT_ROOT / ".env"

load_dotenv(ENV_PATH)

GOOGLE_API_KEY = os.environ["GOOGLE_API_KEY"]