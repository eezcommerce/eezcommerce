# eezcommerce 
## a simple ecommerce platform generator


See [CONTRIBUTING.md](CONTRIBUTING.md) for workflow and rules 

#For editting templates(Post - PR#241)

Themes are contained in the /themes folder and are SCSS files. They are modular and can inherit from one another via the @import rule. default.scss is a good base for any new theme, and any unwanted styles / classes can be overwritten.

It's important to note: since themes cannot modify the stucture or classnames of a site page (.hbs file), we should avoid styling pages using the built in bootstrap classes like mt-5, p-5, text-center etc. since it'll make it more difficult to adjust styling from theme to theme

What you can do, is use the @extend SCSS function if you want to apply a certain bootstrap class to an element. (see .site-navbar in default.scss) where we use @extend .bg-light to apply the light background class and all of it's other functionalities.