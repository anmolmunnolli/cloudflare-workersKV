addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
 const html = data => `
 <!DOCTYPE html>
 <head>
   <meta charset = "UTF-8">
   <meta name= "viewport" content= "width=device-width,initial-scale=1">
   <title>Todos</title>
   <link href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css" rel="stylesheet></link>
 </head>
 <body class="bg-blue-100">
   <div classes="w-full h-full flex content-center justify-center mt-8">
     <div class="bg-white shadow-md rounded px-8 pt-6 py-8 mb-4">
       <h1 class="block text-grey-800 text-md font-bold mb-2">Todos</h1>
         <div class="flex">
           <input class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-800 leading -tight focus:outline-none focus:shadow-outline" type="text" name="name" placeholder="Enter"></input>
           <button class="bg-blue-500 hover:bg-blue-800 text-white font-bold ml-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline" id="create" type="submit">Create</button>
         </div>  
       
       <div class="mt-4" id="todos">
       </div>
     </div>
   </div>
 </body>
 <script>
   window.todos = ${data}
 
 var updateTodos = function(){
   fetch("/",{
     method: 'PUT',
     body: JSON.stringify(window.todos)
   })
   populateTodos()
 }
 
 
 var populateTodos = function(){
   var todoContainer = document.querySelector("#todos")
   todoContainer.innerHTML = null
   window.todos.forEach(todo => {

     var el = document.createElement("div")
     el.className = "border-t py-4"
     el.dataset.todo = todo.id
 
     var name = document.createElement("span")
     name.className = todo.completed ? "line-through" : ""
     name.textContent = todo.name
 
     var checkbox = document.createElement("input")
     checkbox.className = "mx-4"
     checkbox.type = "checkbox"
     checkbox.checked = todo.completed ? 1 : 0
 
     el.appendChild(checkbox)
     el.appendChild(name)
 
     todoContainer.appendChild(el)
 
   })
 }
   populateTodos()
 
   var createTodo =function(){
     var input = document.querySelector("input[name=name]")
     if(input.value.length){
       window.todos = [].concat(todos,{
         id: window.todos.length + 1,
         name: input.value,
         completed: false
       })
       input.value =""
       updateTodos()
     }
   }
 
   document.querySelector("#create").addEventListener('click',createTodo)
 </script>
 </html>
 `


const getCache = key => MY_NEW_KV.get(key)
const setCache = (key, data) => MY_NEW_KV.put(key, data)

const getTodos = async (request) => {
  const cacheKey = "data"
  const cache = await getCache(cacheKey)
  const body = html(JSON.stringify(cache) || [])
  console.log(body)
  return new Response(body,{
    headers: {
      'Content-type': 'text/html'
    }
  } )
}

async function updateTodos(request){
  const body = await request.text()
  const cacheKey = "data"
  try{
    JSON.parse(body)
    await setCache(cacheKey, body)
    return new Response(body, { status: 200})
  }
  catch(err){
    return new Response(err, { status: 500})
  }
}



async function handleRequest(request) {
  if(request.method === "PUT"){
    return updateTodos(request)
  }
  else{
  return getTodos(request)
  }


  // await MY_NEW_KV.put("test-key", "value")
  // const url = new URL(request.url)
  // if(url.pathname==="/set"){
  //   const name = url.searchParams.get("name") || "Anmol"
  //   const user = {name}
  //   const user_json = JSON.stringify(user)
  //   await MY_NEW_KV.put("user",user_json)

  //   return new Response(user_json, {
  //     headers: { 'content-type': 'application/json' },
  //   })  
  // }
  // else{
  //   const value= await MY_NEW_KV.get("user")
  //   return new Response(value, {
  //     headers: { 'content-type': 'application/json' },
  //   })  
  // } 
}
