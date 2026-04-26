import { time } from "node:console";
import { randomUUID } from "node:crypto";
import { title } from "node:process";

export class InMemoryDatabase {
  #recipes = new Map();

  list(search){
    return Array.from(this.#recipes.entries()).map((recipeArr)=>{
        const id = recipeArr[0]
        const data = recipeArr[1]

        return {
            id, 
            ...data,
        }
    })
    .filter(recipe =>{
        if(search) {
            return recipe.title.includes(search)
        }
        return true
    })
   
  }

  create(recipe) {
    const recipeId = randomUUID()

    this.#recipes.set(recipeId, recipe)
  }

  update(id, recipe){
    this.#recipes.set(id, recipe)
  }

  delete(id) {
    this.#recipes.delete(id)
  }

}