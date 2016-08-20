    import { Directive, ElementRef, Input } from '@angular/core';
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