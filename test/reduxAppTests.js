const playwright = require('playwright')
const chai = require('chai')
const expect = chai.expect
const BASE_URL = 'http://localhost:3000/'// For this assignment, kindly change the url with respect to the application build - local, production-ready, production
//In real-world scenario, we will use a .env file to select the environement with the help of dotenv node library.
const or=require('../test/objectRepository')
const reduxApp=require('./ReferFiles/reduxApp')

// playwright variables
let page, browser, context

describe('Redux App Tests', () => {
    var titleName="Title1"
    var authName="Mr. Zola Gutkowski"
    var contentDesc="Random Content"
    beforeEach(async () => {
        browser = await playwright['chromium'].launch({ headless: true })
        context = await browser.newContext()
        page = await context.newPage(BASE_URL)
    })

    afterEach(async function() {
        await browser.close()
    })
    
    describe('Redux App Tests - Common', () => {
        it('Validate Application Title', async() => {
            await page.waitForSelector(or.common.title)
            await page.click(or.common.title)
            var title=await page.$eval(or.common.title, node => node.innerText)
            expect(title).equals('Redux Essentials Example')
        })
    })
    describe('Redux App Tests - Post', () => {
        it('Validate Fields in Post', async() => {
            expect(await page.$(or.post.title)!=null).to.be.ok
            expect(await page.$(or.post.author)!=null).to.be.ok
            expect(await page.$(or.post.content)!=null).to.be.ok
        })
        it('Validate Save Button Enabled/Disabled', async() => {
            var is_disabled = await page.$('button[disabled]') !== null;
            expect(is_disabled).equals(true)
            await page.type(or.post.title,titleName)
            const author = await page.$(or.post.author);
            await page.waitFor(2000)
            await author.type(authName)
            await page.type(or.post.content,contentDesc)   
            is_disabled = await page.$('button[disabled]') !== null;
            expect(is_disabled).equals(false)
        })
        it('Validate Post Details after Saving', async() => {
            await reduxApp.post.createPost(page,titleName,authName,contentDesc)
            var title=await page.$eval(or.post.latestPostTitle, node => node.innerText)
            expect(title).equals(titleName)
            var authorName=await page.$eval(or.post.latestPostAuthor, node => node.innerText)
            expect(authorName).equals("by "+authName)
            var postTime=await page.$eval(or.post.latestPostTime, node => node.innerText)
            expect(postTime).equals("less than a minute ago")
            var content=await page.$eval(or.post.latestPostContent, node => node.innerText)
            expect(content).equals(contentDesc)
        })
        it('Validate View Post', async() => {
            //Existing data on the page may change, hence it is always good practice to create our own data for testing
            await reduxApp.post.createPost(page,titleName,authName,contentDesc)
            await page.click(or.post.viewLatestPost)
            expect(await page.$(or.post.editPost)!=null).to.be.ok
        })
        
        it('Validate Edit Post', async() => {
            //Existing data on the page may change, hence it is always good practice to create our own data for testing
            await reduxApp.post.createPost(page,titleName,authName,contentDesc)
            await page.click(or.post.viewLatestPost)
            expect(await page.$(or.post.editPost)!=null).to.be.ok
            await page.click(or.post.editPost)
            expect(await page.$(or.post.title)!=null).to.be.ok
            expect(await page.$(or.post.content)!=null).to.be.ok
        })
        it('Validate Post After Editing', async() => {
            //Existing data on the page may change, hence it is always good practice to create our own data for testing
            await reduxApp.post.createPost(page,titleName,authName,contentDesc)
            await page.click(or.post.viewLatestPost)
            await reduxApp.post.editPost(page,"Edited Title 1","Edited Content")
            var title=await page.$eval(or.post.viewPostTitle, node => node.innerText)
            var content=await page.$eval(or.post.viewPostContent, node => node.innerText)
            expect(title).equals("Edited Title 1")
            expect(content).equals("Edited Content")
        })
        it('Validate Post Tab', async() => {
            await page.click(or.common.usersTab)
            await page.click(or.common.postsTab)
            var addNewPostLabel=or.common.labelHeading.replace("$","1")
            var postsLabel=or.common.labelHeading.replace("$",2)
            var title1=await page.$eval(addNewPostLabel, node => node.innerText)
            var title2=await page.$eval(postsLabel, node => node.innerText)
            expect(title1).equals("Add a New Post")
            expect(title2).equals("Posts")
        })   
    })
    describe('Redux App Tests - Users', () => {
        it('Validate Users in Users Tab', async() => {
            await page.click(or.common.usersTab)
            await page.waitForSelector(or.user.usersList)
            var text = await page.evaluate(() => Array.from(document.querySelectorAll('div[class="App"]>section>ul>li>a'), element => element.textContent));
            expect(text[0]).equals("Mr. Zola Gutkowski")
            expect(text[1]).equals("Shad Kihn")
            expect(text[2]).equals("Augusta Hahn")
        })
        it('Validate Users Post Screen', async() => {
            //Existing data on the page may change, hence it is always good practice to create our own data for testing
            await reduxApp.post.createPost(page,titleName,authName,contentDesc)
            await page.click(or.common.usersTab)
            await page.waitForSelector(or.user.usersList)
            firstLink=or.user.userNameAndPosts.replace("$","1")
            await page.click(firstLink)
            var text = await page.evaluate(() => Array.from(document.querySelectorAll('div[class="App"]>section>ul>li>a'), element => element.textContent));
            expect(text[0]).equals(titleName)
            var usersTitle=or.common.labelHeading.replace("$","1")
            var title=await page.$eval(usersTitle, node => node.innerText)
            expect(title).equals(authName)
            await page.click(firstLink)
            expect(await page.$(or.post.editPost)!=null).to.be.ok
        })
    })  
    describe('Redux App Tests - Notifications', () => {
        it('Validate Notifications Tab', async() => {
            await page.click(or.common.notificationsTab)
            var notificationTitle=or.common.labelHeading.replace("$","1")
            await page.waitForSelector(notificationTitle)
            var title=await page.$eval(notificationTitle, node => node.innerText)
            expect(title).equals('Notifications')
        })
        it('Validate Notification data', async() => {
            await page.click(or.common.notificationsTab)
            var notificationTitle=or.common.labelHeading.replace("$","1")
            await page.waitForSelector(notificationTitle)
            await page.click(or.notifications.refreshNotification)
            var notificationBox=or.notifications.notificationBox.replace("$","2")
            await page.waitForSelector(notificationBox)
            var notificationName=or.notifications.notificationName.replace("$","2")
            var name=await page.$eval(notificationName, node => node.innerText)
            expect(name).equals('Shad Kihn')
            var notificationMessage=or.notifications.notificationMessage.replace("$","2")
            var message=await page.$eval(notificationMessage, node => node.innerText)
            expect(message).equals('Shad Kihn says hi!')
            var notificationTime=or.notifications.notificationTime.replace("$","2")
            var time=await page.$eval(notificationTime, node => node.innerText)
            expect(time).equals('14 minutes ago')
        })
        it('Validate Unread Notifications', async() => {
            await page.click(or.notifications.refreshNotification)
            await page.waitForSelector(or.common.notificationsTabCount)
            var count=await page.$eval(or.common.notificationsTabCount, node => node.innerText)
            expect(count).equals('1')
            await page.click(or.notifications.refreshNotification)
            await page.waitFor(2000)
            count=await page.$eval(or.common.notificationsTabCount, node => node.innerText)
            expect(count).equals('6')


        })
    })  
})