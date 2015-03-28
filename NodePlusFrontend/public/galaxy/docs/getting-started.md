<aside>

# Table of Contents
- [Installation](#installation)
- [Building Components](#building-components)
- [Toggling States](#using-galaxyjs-to-toggle-states)
- [Contributing](#contributing)
- [MIT License](#licensing)

</aside>

## Getting Started

## Installation

### Galaxy CDN
The quickest way to use Galaxy is by adding the CDN link inside your project's head tag. Galaxy.css is enough for basic Css layouts. However, any interactions involving states (dropdowns, responsive nav) will require galaxy.js (it's only 1kb minified).

#### Galaxy Base (Stylesheet)
`<link rel="stylesheet" href="//cdn.rawgit.com/Magmoz/galaxy/master/galaxy.css">`

#### Galaxy State-toggle (Javascript)
`<script src="//cdn.rawgit.com/Magmoz/galaxy/master/galaxy.js"></script>`

This will always link to the latest version of Galaxy.

### Clone with Git

```
git clone https://github.com/Magmoz/galaxy
```

## Building Components
Galaxy uses HTML and their attributes rather than classes for styling elements. In doing so, each attribute effectively declares a separate namespace for encapsulating style information, resulting in more readable and maintainable HTML & CSS.

For example, a button might have the following markup:

```
<button g="centered large primary" id="send">Submit Form</button>
```
###[View all Components](https://galaxyui.com/components)

## Using Galaxy.js to Toggle States

Galaxy uses CSS to transition, but requires `galaxy.js` to toggle between states. With `galaxy.js`, you can create versatile interactions all without touching Javascript.

### st-group

The `st-group` attribute groups unique components together, and this creates a "connection" between them. For example, two dropdown buttons might be connected with different st-groups:

```
<div g="dropdown" st-group="dropdown_1">
	<button st-group="dropdown_1">Dropdown Button 1</button>
	<ul>
		<li>Option 1</li>
		<li>Option 2</li>
	</ul>
</div>

<div g="dropdown" st-group="dropdown_2">
	<button st-group="dropdown_2">Dropdown Button 2</button>
	<ul>
		<li>Option 1</li>
		<li>Option 2</li>
	</ul>
</div>
```

### st-role (target/ trigger)

`st-role` has two options: As a `trigger`, it will apply a class of `st-state` to the `target`. The `target` is simply the element that is being appended the class. The following example would apply a class of `active` on the parent div when the button is clicked:

```
<div g="dropdown" st-group="dropdown_1" st-role="target">
	<button st-group="dropdown_1" st-role="trigger" st-state="active">Add .active to Parent</button>
	<ul>
		<li>Option 1</li>
		<li>Option 2</li>
	</ul>
</div>
```

With that, you can build interactions for virtually any state.


**Example:**
```
<button g="primary" st-group="modal_fixed_header" st-role="trigger" st-state="active">Activate Modal  (Fixed header</button>

<div st-group="modal_fixed_header" st-role="target" class="modal">
<div st-group="modal_fixed_header" st-role="trigger" st-state="active" class="modal_bg"></div>
<div class="modal_box">
  <div g="fixed" class="header">
     <h1 g="centered">Terms of Service</h1>
  </div>
  <div class="content">
     <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nostrum harum veniam, ut totam aliquid qui laboriosam, recusandae repudiandae quaerat fugiat doloremque eum a facilis rerum amet, ea tempore architecto minima.</p>
  </div>
  <section g="around" class="footer"><button g="primary">I Accept</button><button st-group="modal_fixed_header" st-role="trigger" st-state="active" class="">Close					</button></section>
</div>
</div>
```

## Contributing
Galaxy is currently in Beta, so this means you might run into the ocassional bug. If this is the case, [create an issue](https://github.com/Magmoz/galaxy/issues/new) with the problem and your markup so we can fix it asap.

### Submitting a pull request
There's probably [an open issue right now](https://github.com/Magmoz/galaxy/issues). If you think you've found a solution, please submit a pull request and reference it in the issue. If it hasn't been reported before, just a pull request is necessary.


---

## Licensing

Galaxy was created by [Andy Fang](//twitter.com/andyfang98) and licensed under the [MIT](//tldrlegal.com/license/mit-license). Basically, you can do whatever you want with it as long as the original license stays intact.