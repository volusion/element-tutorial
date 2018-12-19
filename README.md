# Development for the V2 Volusion Storefronts

This document describes how to develop themes and other artifacts that can be
used across all Volusion V2 storefronts.

We created a set of tools to facilitate developing for the Volusion storefront
using standard Javascript, HTML, and CSS. No need to learn yet another proprietary
programming or templating language!

## Vocabulary

With the tools we are providing you, you will be able to build *themes*
composed of *pages* and *blocks*. But before we jump into the details,
let's introduce some important vocabulary that we will be using during this
tutorial.

**Storefront**: A storefront is the web site that all the shoppers of a particular
store see when they access the store's domain.

**Blocks**: Blocks are an important foundation of what we can build for the
storefronts. Internally, they are just self contained apps developed with JS,
HTML and CSS that provide a particular feature for the storefronts. Some block
examples include: A header, a product list, and a product details block. There
is no restriction on how granular or wide-ranging your block can be. As you will see
during the tutorial, you are free to create the block division that makes more
sense to you.

**Themes**: Themes are collections of pages. Pages are collections of blocks. Initially
a page is a blank canvas, where you can add as many blocks as you like. A block
can be the full page, or you can create as many blocks as you want to build the
page. Blocks can be reused across multiple pages or even in the same page.


## Tools

We will be introducing to you the following tools to make the development process
easier.

**Site Designer**: The Site Designer is the web application where you build your
storefront themes. Here you will be able to add pages, add blocks to them, and
configure your blocks, pages and themes according to your needs.

**CLI**: The CLI is a command line interface with some handy operations that will
guide you through the process of building, testing, publishing, and maintaining blocks.


## Before we start

There are just two prerequisites before we start:

* An active store. 

  Access to the storefront admin at [Admin Store Login][login]

* A recent version of Node.js (version 8 or greater) and git on your system.


## Organization

This tutorial is split into several chapters in the `section*/` subdirectories. Just
read the `README.md` file in each subdirectory in order to follow the tutorial:

* [Section 1 - The Block Starter][section1]
* [Section 2 - Communicating with the Volusion API][section2]
* [Section 3 - Block UI and configuration][section3]
* [Section 4 - Publishing and using the block][section4]

[login]: https://www.volusion.com/login
[section1]: ./section1
[section2]: ./section2
[section3]: ./section3
[section4]: ./section4
