from typing import Dict, List, Sequence
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, StateGraph
from langgraph.graph.message import add_messages
from typing_extensions import Annotated, TypedDict

from built_retriever import retriever
from source.load_llm import llm
def process(messages: List[Dict[str, str]], id = "abc123"):
    contextualize_q_system_prompt = (
        "Dựa trên lịch sử cuộc trò chuyện và câu hỏi mới nhất của người dùng có thể tham chiếu đến ngữ cảnh trong lịch sử trò chuyện, "
        "hãy tạo thành một câu hỏi độc lập có thể hiểu được mà không cần lịch sử cuộc trò chuyện."
        " KHÔNG trả lời câu hỏi, chỉ cần điều chỉnh lại nếu cần, nếu không thì giữ nguyên."
    )
    contextualize_q_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)

    system_prompt = (
        "Bạn là một trợ lý cho các nhiệm vụ trả lời câu hỏi về trường đại học Công nghệ thông tin (UIT) một cách chi tiết."
        " Sử dụng những mẩu ngữ cảnh được truy xuất sau để trả lời câu hỏi và giải thích chi tiết cho người dùng hiểu những chỗ chưa rõ ràng dựa trên những mẩu ngữ cảnh bạn được nhận. "
        "Nếu bạn không biết câu trả lời, hãy nói rằng bạn không biết."
        "\n\n"
        "Các mẩu ngữ cảnh: {context}"
    )
    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

    class State(TypedDict):
        input: str
        chat_history: Annotated[Sequence[BaseMessage], add_messages]
        context: str
        answer: str


    def call_model(state: State):
        response = rag_chain.invoke(state)
        return {
            "chat_history": [
                HumanMessage(state["input"]),
                AIMessage(response["answer"]),
            ],
            "context": response["context"],
            "answer": response["answer"],
        }


    workflow = StateGraph(state_schema=State)
    workflow.add_edge(START, "model")
    workflow.add_node("model", call_model)

    memory = MemorySaver()
    app = workflow.compile(checkpointer=memory)
    config = {"configurable": {"thread_id": id}}

    chat_history = [
        HumanMessage(msg["content"]) if msg["role"] == "user" else AIMessage(msg["content"])
        for msg in messages[:-1]
    ]

    input = messages[-1]["content"]
    result = app.invoke(
        {"input": input, "chat_history": chat_history},
        config=config
    )
    return result["answer"]

print(process([{"role": "user", "content": "Nếu muốn học về lập trình ứng dụng phần mềm thì nên theo học ngành nào?"},
               {"role": "system", "content": "Nếu bạn muốn học về lập trình ứng dụng phần mềm, bạn nên theo học ngành Công nghệ Phần mềm tại trường Đại học Công nghệ Thông tin (UIT). Trong ngành này, bạn sẽ được học về cách phát triển và quản lý các phần mềm ứng dụng trên nhiều nền tảng khác nhau như web, di động, máy tính cá nhân, v.v. Ngành Công nghệ Phần mềm tại UIT cung cấp kiến thức vững chắc về lập trình, thiết kế phần mềm, kiểm thử, quản lý dự án phần mềm và nhiều kỹ năng khác liên quan đến phát triển phần mềm."},
               {"role": "user", "content": "Ngành này là ngành gì?"}]))