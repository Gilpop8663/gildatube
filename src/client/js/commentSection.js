import regeneratorRuntime from "regenerator-runtime";

const videoContainer =document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const commentsContainer = document.querySelector(".video__comments ul");
const commentlist = commentsContainer.querySelector("li");
const commentDelBtn = document.querySelector(".remove");


const addComment=(text,id)=>{
  const li = document.createElement("li");
  const icon = document.createElement("i");
  const span = document.createElement("span");
  const span2 = document.createElement("span");
  li.dataset.id = id
  icon.className="fas fa-comment";
  li.classList.add("comment__text");
  span2.innerText ="❌";
  span2.classList.add("remove");
  span.innerText = `${text}`;
  li.appendChild(icon);
  li.appendChild(span);
  li.appendChild(span2);
  commentsContainer.prepend(li);

}

const handleDelete = async (event) => {
  event.preventDefault();
  if(event.target.className !== "remove"){
    return;
  }
  const videoId = videoContainer.dataset.id;
  const li = event.target.parentNode;
  const commentId = li.dataset.id;
  const response = await fetch(`/api/videos/${commentId}/delete`,{
    method:"DELETE",
  });
  if(response === 200){
    li.remove();
  }
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

if(commentlist){
  commentDelBtn.addEventListener("click",handleDelete);
}