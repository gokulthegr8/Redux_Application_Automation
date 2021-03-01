const playwright = require('playwright')
const chai = require('chai')
const expect = chai.expect
const or=require('../objectRepository')

    module.exports={
        post:{
            /**
             * Creates a Post with the given title, authorName, and content
             * @page pass page to playwright
             * @title the title of the post
             * @authorName the author name of the post
             * @content the content for the post
             */             
            async createPost(page,title,authorName,content){
                await page.type('#postTitle',title)
                const author = await page.$("#postAuthor");
                await page.waitFor(2000)
                await author.type(authorName)
                await page.type('#postContent',content)   
                await page.click('form>button')
                await page.waitFor(3000)
            },
            /**
             * Edits a Post with the given title and content
             * @page pass page to playwright
             * @title the title of the post that is to be edited
             * @content the content for the post that is to be edited
             */ 
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
