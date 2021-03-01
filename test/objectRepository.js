module.exports = {
    common:{
        title:'#root>nav>section>h1',
        postsTab:'div[class="navLinks"]>a[href="/"]',
        usersTab:'div[class="navLinks"]>a[href="/users"]',
        notificationsTab:'div[class="navLinks"]>a[href="/notifications"]',
        labelHeading:'div[class="App"]>section:nth-child($)>h2'
    },

    post:{
        title:'#postTitle',
        author:'#postAuthor',
        content:'#postContent',
        latestPostTitle:'article[class="post-excerpt"]:nth-child(2)>h3',
        latestPostAuthor:'article[class="post-excerpt"]:nth-child(2)>div>span',
        latestPostContent:'article[class="post-excerpt"]:nth-child(2)>p[class="post-content"]',
        latestPostTime:'article[class="post-excerpt"]:nth-child(2)>div>span:nth-child(2)>i',
        viewLatestPost:'article[class="post-excerpt"]:nth-child(2)>a',
        editPost:'article[class="post"]>a',
        viewPostTitle:'article[class="post"]>h2',
        viewPostContent:'article[class="post"]>p',
    },

    user:{
        usersList:'div[class="App"]>section>ul>li>a',
        userNameAndPosts:'div[class="App"]>section>ul>li:nth-child($)>a'
    },

    notifications:{
        refreshNotification:'div[class="navContent"]>button[class="button"]',
        notificationBox:'div[class="notification new"]:nth-child($)',
        notificationName:'div[class="notification new"]:nth-child($)>div>b',
        notificationMessage:'div[class="notification new"]:nth-child($)>div',
        notificationTime:'div[class="notification new"]:nth-child($)>div>i'
    }
}

