    import { Directive, ElementRef, Input, Renderer } from '@angular/core';
    declare var $: JQueryStatic;

    @Directive({ selector: '[myHighlight]' })
    export class HighlightDirective {
        constructor(el: ElementRef) {
           el.nativeElement.style.backgroundColor = 'yellow';
        }
    }

    @Directive({ selector: '[range-slider]' })
    export class RangeSlider {
        constructor(el: ElementRef) {
        }
    }

    @Directive({
        selector: 'input,select',
        host: { '(blur)': 'onBlur($event)' , '(contextmenu)': 'onContextMenu($event)', '(ngModelChange)':'onBlur($event)'}
    })
    export class BlurForwarder {
        constructor(private elRef: ElementRef, private renderer: Renderer) { }

        onBlur($event) {
            this.renderer.invokeElementMethod(this.elRef.nativeElement,
                'dispatchEvent',
                [new CustomEvent('input-blur', { bubbles: true })]);
            // or just 
            // el.dispatchEvent(new CustomEvent('input-blur', { bubbles: true }));
            // if you don't care about webworker compatibility
        }

        onContextMenu($event) {
            console.log("=== context menu ===");
            console.log(this.elRef.nativeElement);
            // return false;
        }
    }