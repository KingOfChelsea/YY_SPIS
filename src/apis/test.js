import httpInstance from "@/utils/http"

export function getCategory(){
 return httpInstance({
    url:'menus?role_id=1'
  })
}


