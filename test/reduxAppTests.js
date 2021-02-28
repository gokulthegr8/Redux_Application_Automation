const playwright = require('playwright')
const chai = require('chai')
const expect = chai.expect
const BASE_URL = 'http://localhost:3000/'
const ObjectRepository=require('../test/objectRepository')

// playwright variables
let page, browser, context

describe('Redux App Tests', () => {
    let or= new ObjectRepository()
    beforeEach(async () => {
        browser = await playwright['chromium'].launch({ headless: true })
        context = await browser.newContext()
        page = await context.newPage(BASE_URL)
        
    })

    afterEach(async function() {
        await browser.close()
    })
    
    describe('Redux App Tests - Common', () => {
        // it('Validate Application Title', async() => {
        //     await page.waitForSelector(or.wd.common.title)
        //     await page.click(or.wd.common.title)
        //     var title=await page.$eval(or.wd.common.title, node => node.innerText)
        //     expect(title).equals('Redux Essentials Example')
        // })
    })
    describe('Redux App Tests - Post', () => {
        it('Validate Fields in Post', async() => {
            expect(await page.$('#postTitle')!=null).to.be.ok
            expect(await page.$('#postAuthor')!=null).to.be.ok
            expect(await page.$('#postContent')!=null).to.be.ok
        })
        it('Validate Save Button Enabled/Disabled', async() => {
            var is_disabled = await page.$('button[disabled]') !== null;
            expect(is_disabled).equals(true)
            await page.type('#postTitle',"Title1")
            const author = await page.$("#postAuthor");
            await page.waitFor(2000)
            await author.type('Mr. Zola Gutkowski')
            await page.type('#postContent',"Random Content")   
            is_disabled = await page.$('button[disabled]') !== null;
            expect(is_disabled).equals(false)
        })
        it('Validate Post Details after Saving', async() => {
            await page.type('#postTitle',"Title1")
            const author = await page.$("#postAuthor");
            await page.waitFor(2000)
            await author.type('Mr. Zola Gutkowski')
            await page.type('#postContent',"Random Content")   
            await page.click('form>button')
            await page.waitFor(3000)
            var title=await page.$eval('article[class="post-excerpt"]:nth-child(2)>h3', node => node.innerText)
            expect(title).equals("Title1")
            var authorName=await page.$eval('article[class="post-excerpt"]:nth-child(2)>div>span', node => node.innerText)
            expect(authorName).equals("by Mr. Zola Gutkowski")
            var postTime=await page.$eval('article[class="post-excerpt"]:nth-child(2)>div>span:nth-child(2)>i', node => node.innerText)
            expect(postTime).equals("less than a minute ago")
            var content=await page.$eval('article[class="post-excerpt"]:nth-child(2)>p[class="post-content"]', node => node.innerText)
            expect(content).equals("Random Content")
        })
        it('Validate View Post', async() => {
            //Existing data on the page may change, hence it is always good practice to create our own data for testing
            await page.type('#postTitle',"Title1")
            const author = await page.$("#postAuthor");
            await page.waitFor(2000)
            await author.type('Mr. Zola Gutkowski')
            await page.type('#postContent',"Random Content")   
            await page.click('form>button')
            await page.waitFor(3000)
            await page.click('article[class="post-excerpt"]:nth-child(2)>a')
            expect(await page.$('article[class="post"]')!=null).to.be.ok
        })
        
        it('Validate Edit Post', async() => {
            //Existing data on the page may change, hence it is always good practice to create our own data for testing
            await page.type('#postTitle',"Title1")
            const author = await page.$("#postAuthor");
            await page.waitFor(2000)
            await author.type('Mr. Zola Gutkowski')
            await page.type('#postContent',"Random Content")   
            await page.click('form>button')
            await page.waitFor(3000)
            await page.click('article[class="post-excerpt"]:nth-child(2)>a')
            expect(await page.$('article[class="post"]>a')!=null).to.be.ok
            await page.click('article[class="post"]>a')
            expect(await page.$('#postTitle')!=null).to.be.ok
            expect(await page.$('#postContent')!=null).to.be.ok
        })
        it('Validate Post After Editing', async() => {
            //Existing data on the page may change, hence it is always good practice to create our own data for testing
            await page.type('#postTitle',"Title1")
            const author = await page.$("#postAuthor");
            await page.waitFor(2000)
            await author.type('Mr. Zola Gutkowski')
            await page.type('#postContent',"Random Content")   
            await page.click('form>button')
            await page.waitFor(3000)
            await page.click('article[class="post-excerpt"]:nth-child(2)>a')
            await page.click('article[class="post"]>a')
            await page.click('#postTitle',{clickCount: 3})
            await page.keyboard.press('Backspace');
            await page.type('#postTitle',"Edited Title 1")
            await page.click('#postContent',{clickCount: 3})
            await page.keyboard.press('Backspace');
            await page.type('#postContent',"Edited Content")
            await page.click('button[type="button"]')
            var title=await page.$eval('article[class="post"]>h2', node => node.innerText)
            var content=await page.$eval('article[class="post"]>p', node => node.innerText)
            expect(title).equals("Edited Title 1")
            expect(content).equals("Edited Content")
        })
        it('Validate Post Tab', async() => {
            await page.click('div[class="navLinks"]>a[href="/users"]')
            await page.click('div[class="navLinks"]>a[href="/"]')
            var title1=await page.$eval('div[class="App"]>section:nth-child(1)>h2', node => node.innerText)
            var title2=await page.$eval('div[class="App"]>section:nth-child(2)>h2', node => node.innerText)
            expect(title1).equals("Add a New Post")
            expect(title2).equals("Posts")
        })   
    })
    describe('Redux App Tests - Users', () => {
        it('Validate Users in Users Tab', async() => {
            await page.click('div[class="navLinks"]>a[href="/users"]')
            await page.waitForSelector('div[class="App"]>section>ul>li>a')
            var text = await page.evaluate(() => Array.from(document.querySelectorAll('div[class="App"]>section>ul>li>a'), element => element.textContent));
            expect(text[0]).equals("Mr. Zola Gutkowski")
            expect(text[1]).equals("Shad Kihn")
            expect(text[2]).equals("Augusta Hahn")
        })
        it('Validate Users Post Screen', async() => {
            //Existing data on the page may change, hence it is always good practice to create our own data for testing
            await page.type('#postTitle',"Title1")
            const author = await page.$("#postAuthor");
            await page.waitFor(2000)
            await author.type('Mr. Zola Gutkowski')
            await page.type('#postContent',"Random Content")   
            await page.click('form>button')
            await page.waitFor(3000)
            await page.click('div[class="navLinks"]>a[href="/users"]')
            await page.waitForSelector('div[class="App"]>section>ul>li>a')
            await page.click('div[class="App"]>section>ul>li:nth-child(1)>a')
            var text = await page.evaluate(() => Array.from(document.querySelectorAll('div[class="App"]>section>ul>li>a'), element => element.textContent));
            expect(text[0]).equals("Title1")
            var title=await page.$eval('div[class="App"]>section>h2', node => node.innerText)
            expect(title).equals('Mr. Zola Gutkowski')
            await page.click('div[class="App"]>section>ul>li:nth-child(1)>a')
            expect(await page.$('article[class="post"]')!=null).to.be.ok
        })
    })  
    describe('Redux App Tests - Notifications', () => {
        it('Validate Notifications Tab', async() => {
            await page.click('div[class="navLinks"]>a[href="/notifications"]')
            await page.waitForSelector('div[class="App"]>section>h2')
            var title=await page.$eval('div[class="App"]>section>h2', node => node.innerText)
            expect(title).equals('Notifications')
        })
        it('Validate Notification data', async() => {
            await page.click('div[class="navLinks"]>a[href="/notifications"]')
            await page.waitForSelector('div[class="App"]>section>h2')
            await page.click('div[class="navContent"]>button[class="button"]')
            await page.waitForSelector('div[class="notification new"]')
            var name=await page.$eval('div[class="notification new"]>div>b', node => node.innerText)
            expect(name).equals('Shad Kihn')
            var message=await page.$eval('div[class="notification new"]>div', node => node.innerText)
            expect(message).equals('Shad Kihn says hi!')
            var message=await page.$eval('div[class="notification new"]>div>i', node => node.innerText)
            expect(message).equals('14 minutes ago')
        })
    })  
})