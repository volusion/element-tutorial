# The element CLI

The element CLI is a command line utility that will support tasks related to `Block` development. Some of those tasks are:

- Authenticating with the Volusion auth system.
- Creating project boilerplate.
- Publishing blocks.
- Updating blocks.
- Releasing and rolling back block versions.

This document will help you getting started and will provide best practices for block development along the way.

This document includes [a short version for a quick reference](#using-the-cli-for-the-impatient).

## Getting the CLI

To install the CLI, run the following command. Node version 8 or higher is required:

```bash
npm install -g @volusion/element-cli
```

If the installation is successful, you should be able to run the following command an get back the current installed version:

```bash
element -v
```

> Pro Tip: Remember to check the available commands with `element --help`

## Using the CLI

### Authenticate

The first step is to authenticate yourself using your Volusion credentials. As the credentials, you should use the same username and password that you use to connect to your Volusion store.

Running the following command, will ask your username and password:

```bash
element login
```

### Creating a block

In order to create a block, we can use the `new` command.

You can also ask for a specific command info, by running:

```bash
element new -h
```

Let's create our new block:

```bash
element new MyFirstBlock
```

> Pro Tip: Use camel case or dash separated words as your block folder name

The command will create a folder in the current directory called `MyFirstBlock` with the contents of the [Block starter project][starter] cloned into it. For more info about the contents of that folder, follow the [main tutorial][main], section `The block starter structure`

### Building and publishing

Next, let's build and publish the block.

Change your directory to the folder we just created and build the project:

```bash
cd MyFirstBlock
npm install
npm run build
```

Finally, let's publish the block. This time, we will use the `publish` command.

> Pro Tip: Remember to check the command options by running `element publish -h`

```bash
element publish -n "My first block"
```

The CLI will ask you next which block category you want to use to publish the block:

```bash
? Select the Category that best fits this block:
  Services
  Promos & Announcements
  Products
❯ Misc
  Image Gallery
  Hero Image Banners
  Headers
(Move up and down to reveal more choices)
```

Pick the one that best describe your block using the arrows and press enter.

You should get a message saying that the block was published for staging v1 and the block id:

```
            Published My First Block v1 for staging
            ID XXXXXX7667684XXXXX
```

From the success message, we discovered that:

- The block got assigned a default version (1)
- The block was tagged as staging.

At this point, your block is already published at Volusion. But, your block is not visible still for merchants. The staging flag means that the block is under development, so only you, as the author, will be able to use it.

> Pro Tip: Keep in mind two important concepts, block visibility (public vs private), and block status (staging vs active)

**Public vs Private**

A block can be private. That means that you don't want it to be generally available to all merchants. This is useful if you are developing a theme for a customer that requires exclusiveness. Public blocks are those that you want to be available for all merchants.

**Staging vs Active**

Staging basically means, non released. It's a useful state for developers, to test their blocks before releasing them. And active means that the block was released and is in production (respecting the visibility rules - private or public)

> Pro Tip: Remember, when publishing a block, the defaults are: Private and Staging

### Making changes and publishing them

You can safely make as many changes as you want as currently our block is in staging. Feel free to make a change, and build your project again:

```bash
npm run build
```

Then, we are ready to update our block bundle by using the `update` command

```bash
element update
```

If all is good, you will see a confirmation message.

```bash
            Updated My First Block v1 for staging
            ID XXXXXX7667684XXXXX
```

### Before Releasing

If you want to toggle the visibility of your block, to make it public, you can use the `update` command with the `-p` flag.

```bash
element update -p
```

If you forget to do this _before_ releasing, you can still toggle the visibility but will need to draft a new release. More on this later.

### Releasing

When we are ready to release a block (changing its state from Staging to Active), we can use the `release` command

> Pro Tip: As always, feel free to run `element release -h`

Releasing is easy, just provide an optional but helpful release note:

```bash
element release -n "First release notes"
```

As always, we get the confirmation message:

```bash
            Released My First Block v1 for production
            ID XXXXXX7667684XXXXX
```

The message says that our block is ready for production (active).

> Pro Tip: After releasing it's a good idea to create a commit message, as a checkpoint if we need to make a rollback: `git commit -m "v1 released"`

### Major vs Minor versions

A block can have multiple major versions. And inside each major version, a block may have many minor releases.

This is the difference between a minor and a major release:

**Minor releases** are propagated automatically to all the users of your block. This is a really convenient way of shipping bug fixes and new features that don't affect the block look and feel or the block configuration. The block users need to perform no action in order to get your updates.

**Major releases** are not propagated automatically and users need to manually update their block versions. Major releases are important to ship new features on a block that are not compatible or can potentially change the look and feel of current store fronts.

> Pro Tip: At this time, making changes to the block configuration labels (Proptypes) is a breaking change.

### Creating a minor release

Let's say you found a bug affecting all the users of your block. And, you want to fix it on the fly to all your block users.

First, make your changes and build:

```
npm run build
```

Then, run the update command:

```
element update
```

> Pro Tip: Don't worry, this will create a new staging version and won't be shipped just yet.

Go to your Site Designer instance and test the change. As you are the block author, the Site Designer will show you the staging version of the block for your tests.

When you are ready, just create a new release:

```
element release -n "Bug fix notes"
```

> Pro Tip: It's time to create another commit: `git commit -m "v1 bug fix released"`

At this point, after a page refresh, all the users of your block will get the updates. They don't have to do anything.

### Rolling back a minor release

We are humans. What if we made a mistake and released something that was not ready yet?

We can use the `rollback` command.

The `rollback` command will jump back between minor versions, until hitting the major version. So, you can rollback until reaching the major release of the version you are currently at.

In our example, we had a release for the major version, that we tagged with the commit message `v1 released`, and we also released a minor version with the commit message `v1 bug fix released`. Assuming tha the bug fix went terribly wrong, we can do:

```bash
element rollback
```

The system will mark the bug fix as staging again, so you can do proper fixing before releasing again. What this means, is that users will get the released version of the block, in our example, the major release tagged with `v1 released`.

You can then fix the issue and release again:

```
npm run build
element release -n "v1 bug fix second try"
```

> Pro Tip: It's a good time to create a new commit, as a checkpoint of the released block

Or, maybe, you don't want to release again, but discard the staging version of the block and start fresh. You can do that by running the rollback command one more time:

```
element rollback
```

This will remove the staging version of the block, and ship the initial version to the users.

> Pro Tip: We recommend to checkout your repo and point your code to the commit `v1 released`

You can then make changes, and start fresh, from the `v1 released` commit state.

### Creating a Major release

Maybe you are adding new features to your block, the block configuration is not compatible with the previous, and/or the look and feel of the block changed. Those are all good reasons to create a major release.

In order to do that, we recommend to create a new branch, where you will keep the `version 2` of the code:

```bash
git checkout -b version2
```

Then, run the following `publish` command with the `-m` flag:

```bash
element publish -m
```

The system will tell you that a new v2 was published for the block, as staging:

```bash
            Published My First Block v2 for staging
            ID XXXXXX7667684XXXXX
```

### Releasing minor versions to v1 and v2

You can keep both of your block versions bug free. This is what you can do to release a minor version of v1. Remember that right now, we are in branch `version2`.

```bash
git checkout master
npm run build
element update
element release -n "v1 new minor release"
git commit -m "v1 new minor release"
```

And now, you can start following the same steps we have learned so far.

## Using the CLI for the impatient

This is a fast guide on how to use the CLI:

```bash
# Install the CLI
npm install -g @volusion/element-cli

# Authenticate
element login

# New block
element new MyBlock
cd MyBlock

# Some git love
git init
git add .
git commit "Initial commit"

# Install deps
npm install

# Make changes/develop your block (Loop as needed)
npm run build

# Publish when ready (Don't worry, it won't be public yet)
element publish -n "My Block"
# Pick category from CLI menu

# Make the block public if that's what you want
element update -p

# Release the block
element release -n "First version release note"

# Keep track of the release on your git repo
git add .
git commit -m "v1 released"

# For a minor release
# Make changes (Loop as needed until done)
npm run build
element update

# Release when ready
element release -n "v1.1 notes"

# Keep track of the release on your git repo
git add .
git commit -m "v1.1 released"

# Ups, made a mistake
element rollback
npm run build
element update
element release -n "v1.1 updated"

git commit -m "v1.1 released again"

# New major release (From v1 to v2)
git checkout -b version2
element publish -m

# And repeat an profit the steps (update, release)

# Make a minor change to v1
git checkout master

#make changes
npm run build
element update
element release -n "v1.2 released"

# As always, remember to save the relaese as a commit
git add .
git commit -m "v1.2 released"
```

https://github.com/Volusion2Dev/block-StockApps/pull/6

[starter]: https://github.com/volusion/element-BlockStarter
[main]: ../section1
