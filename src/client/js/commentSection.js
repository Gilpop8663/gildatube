import { async } from "regenerator-runtime";

const videoContainer =document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment=(text,id)=>{
  const commentsContainer = document.querySelector(".video__comments ul");
  const li = document.createElement("li");
  const icon = document.createElement("i");
  const span = document.createElement("span");
  const span2 = document.createElement("span");
  li.dataset.id = id
  span2.innerText ="❌";
  icon.className="fas fa-comment";
  li.classList.add("comment__text");
  span.innerText = `${text}`;
  li.appendChild(icon);
  li.appendChild(span);
  li.appendChild(span2);
  commentsContainer.prepend(li);

}

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const btn = form.querySelector("button");
  const text = textarea.value
  const videoId = videoContainer.dataset.id;
  if(text === ""){
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({text:text}),
  });
  const {newCommentId} = await response.json();
  if(response.status ===201){
    addComment(text,newCommentId);
  }
  textarea.value="";
}

if(form){
  form.addEventListener("submit",handleSubmit);
}