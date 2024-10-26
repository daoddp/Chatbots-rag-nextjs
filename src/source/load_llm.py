from dotenv import load_dotenv


load_dotenv()

# Import LangChain's OpenAI interface and initialize the model
from langchain_openai import ChatOpenAI

# Initialize the model
llm = ChatOpenAI(model="gpt-4o-mini")
