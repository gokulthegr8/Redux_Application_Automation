const playwright = require('playwright')
const chai = require('chai')
const expect = chai.expect
const or=require('../objectRepository')

    module.exports={
        post:{
            async createPost(page,title,authorName,content){
                await page.type('#postTitle',title)
                const author = await page.$("#postAuthor");
                await page.waitFor(2000)
                await author.type(authorName)
                await page.type('#postContent',content)   
                await page.click('form>button')
                await page.waitFor(3000)
            },
            async editPost(page,title,content){
                await page.click(or.post.editPost)
                await page.click(or.post.title,{clickCount: 3})
                await page.keyboard.press('Backspace');
                await page.type(or.post.title,title)
                await page.click(or.post.content,{clickCount: 3})
                await page.keyboard.press('Backspace');
                await page.type(or.post.content,content)
                await page.click('button[type="button"]')
            }
        },
        users:{
            
        },
        notifications:{

        },
        common:{
            
        }
        
    }
