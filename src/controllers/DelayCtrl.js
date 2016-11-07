/* ---------------------------- */
/* --- Delay UI controller --- */
/* ---------------------------- */

(function() {
    'use strict';

    define(['require', 'DropMenu', 'Dial', 'Numberbox'], function(require, DropMenu, Dial, Numberbox) {

        const DelayCtrl = function DelayCtrl(adt) {
            let delay = {};

            adt.delay.delayTimeLDial = new Dial({
                container: document.querySelector('#additor .delay-ctrl .delayTime-ctrl .L .dial'),
                value: Math.trunc(adt.delay.node.delayTimeL.value * 10),
                minValue: 0,
                maxValue: 1000
              })
              .subscribe(this, (val) => {
                adt.delay.node.delayTimeL.value = val / 100;
                adt.delay.delayTimeLNumbox.value = val * 10;
            });

            adt.delay.delayTimeLNumbox = new Numberbox({
                container: document.querySelector('#additor .delay-ctrl .delayTime-ctrl .L .numbox'),
                value: adt.delay.node.delayTimeL.value,
                minValue: 0,
                maxValue: 10000,
                appendString: ' ms'
              })
              .subscribe(this, (val) => {
                adt.delay.node.delayTimeL.value = val / 1000;
                adt.delay.delayTimeLDial.value = val / 10;
            });

            adt.delay.delayTimeRDial = new Dial({
                container: document.querySelector('#additor .delay-ctrl .delayTime-ctrl .R .dial'),
                value: adt.delay.node.delayTimeR.value,
                minValue: 0,
                maxValue: 1000
              })
              .subscribe(this, (val) => {
                adt.delay.node.delayTimeR.value = val / 100;
                adt.delay.delayTimeRNumbox.value = val * 10;
            });

            adt.delay.delayTimeRNumbox = new Numberbox({
                container: document.querySelector('#additor .delay-ctrl .delayTime-ctrl .R .numbox'),
                value: adt.delay.node.delayTimeR.value,
                minValue: 0,
                maxValue: 10000,
                appendString: ' ms'
              })
              .subscribe(this, (val) => {
                adt.delay.node.delayTimeR.value = val / 1000;
                adt.delay.delayTimeRDial.value = val / 10;
            });

            adt.delay.feedbackLDial = new Dial({
                container: document.querySelector('#additor .delay-ctrl .feedback-ctrl .L .dial'),
                value: Math.trunc(adt.delay.node.feedbackL.value * 100),
                minValue: 0,
                maxValue: 100
              })
              .subscribe(this, (val) => {
                adt.delay.node.feedbackL.value = val / 100;
                adt.delay.feedbackLNumbox.value = val;
            });

            adt.delay.feedbackLNumbox = new Numberbox({
                container: document.querySelector('#additor .delay-ctrl .feedback-ctrl .L .numbox'),
                value: Math.trunc(adt.delay.node.feedbackL.value * 100),
                minValue: 0,
                maxValue: 100,
                appendString: ' %'
              })
              .subscribe(this, (val) => {
                adt.delay.node.feedbackL.value = val / 100;
                adt.delay.feedbackLDial.value = val;
            });

            adt.delay.feedbackRDial = new Dial({
                container: document.querySelector('#additor .delay-ctrl .feedback-ctrl .R .dial'),
                value: Math.trunc(adt.delay.node.feedbackL.value * 100),
                minValue: 0,
                maxValue: 100
              })
              .subscribe(this, (val) => {
                adt.delay.node.feedbackR.value = val / 100;
                adt.delay.feedbackRNumbox.value = val;
            });

            adt.delay.feedbackRNumbox = new Numberbox({
                container: document.querySelector('#additor .delay-ctrl .feedback-ctrl .R .numbox'),
                value: Math.trunc(adt.delay.node.feedbackL.value * 100),
                minValue: 0,
                maxValue: 100,
                appendString: ' %'
              })
              .subscribe(this, (val) => {
                adt.delay.node.feedbackR.value = val;
                adt.delay.feedbackRDial.value = val;
            });

            adt.delay.dryMixLDial = new Dial({
                container: document.querySelector('#additor .delay-ctrl .dryMix-ctrl .L .dial'),
                value: Math.trunc(adt.delay.node.dryMixL.value * 100),
                minValue: 0,
                maxValue: 100
              })
              .subscribe(this, (val) => {
                adt.delay.node.dryMixL.value = val / 100;
                adt.delay.dryMixLNumbox.value = val;
            });

            adt.delay.dryMixLNumbox = new Numberbox({
                container: document.querySelector('#additor .delay-ctrl .dryMix-ctrl .L .numbox'),
                value: Math.trunc(adt.delay.node.dryMixL.value * 100),
                minValue: 0,
                maxValue: 100,
                appendString: ' %'
              })
              .subscribe(this, (val) => {
                adt.delay.node.dryMixL.value = val / 100;
                adt.delay.dryMixLDial.value = val;
            });

            adt.delay.dryMixRDial = new Dial({
                container: document.querySelector('#additor .delay-ctrl .dryMix-ctrl .R .dial'),
                value: Math.trunc(adt.delay.node.dryMixR.value * 100),
                minValue: 0,
                maxValue: 100
              })
              .subscribe(this, (val) => {
                adt.delay.node.dryMixR.value = val / 100;
                adt.delay.dryMixRNumbox.value = val;
            });

            adt.delay.dryMixRNumbox = new Numberbox({
                container: document.querySelector('#additor .delay-ctrl .dryMix-ctrl .R .numbox'),
                value: Math.trunc(adt.delay.node.dryMixR.value * 100),
                minValue: 0,
                maxValue: 100,
                appendString: ' %'
              })
              .subscribe(this, (val) => {
                adt.delay.node.dryMixR.value = val / 100;
                adt.delay.dryMixRDial.value = val;
            });


            adt.delay.wetMixLDial = new Dial({
                container: document.querySelector('#additor .delay-ctrl .wetMix-ctrl .L .dial'),
                value: Math.trunc(adt.delay.node.wetMixL.value * 100),
                minValue: 0,
                maxValue: 100
              })
              .subscribe(this, (val) => {
                adt.delay.node.wetMixL.value = val / 100;
                adt.delay.wetMixLNumbox.value = val;
            });

            adt.delay.wetMixLNumbox = new Numberbox({
                container: document.querySelector('#additor .delay-ctrl .wetMix-ctrl .L .numbox'),
                value: Math.trunc(adt.delay.node.wetMixL.value * 100),
                minValue: 0,
                maxValue: 100,
                appendString: ' %'
              })
              .subscribe(this, (val) => {
                adt.delay.node.wetMixL.value = val / 100;
                adt.delay.wetMixLDial.value = val;
            });

            adt.delay.wetMixRDial = new Dial({
                container: document.querySelector('#additor .delay-ctrl .wetMix-ctrl .R .dial'),
                value: Math.trunc(adt.delay.node.wetMixR.value * 100),
                minValue: 0,
                maxValue: 100
              })
              .subscribe(this, (val) => {
                adt.delay.node.wetMixR.value = val / 100;
                adt.delay.wetMixRNumbox.value = val;
            });

            adt.delay.wetMixRNumbox = new Numberbox({
              container: document.querySelector('#additor .delay-ctrl .wetMix-ctrl .R .numbox'),
              value: Math.trunc(adt.delay.node.wetMixR.value * 100),
              minValue: 0,
              maxValue: 100,
              appendString: ' %'
              })
              .subscribe(this, (val) => {
                adt.delay.node.wetMixR.value = val / 100;
                adt.delay.wetMixRDial.value = val;
            });

            adt.delay.updateUI = function () {
              adt.delay.delayTimeLDial.value = Math.trunc(adt.delay.node.delayTimeL.value * 100);
              adt.delay.delayTimeLNumbox.value = Math.trunc(adt.delay.node.delayTimeL.value * 1000);
              adt.delay.delayTimeRDial.value = Math.trunc(adt.delay.node.delayTimeR.value * 100);
              adt.delay.delayTimeRNumbox.value = Math.trunc(adt.delay.node.delayTimeR.value * 1000);
              adt.delay.feedbackLDial.value = Math.trunc(adt.delay.node.feedbackL.value * 100);
              adt.delay.feedbackLNumbox.value = Math.trunc(adt.delay.node.feedbackL.value * 100);
              adt.delay.feedbackRDial.value = Math.trunc(adt.delay.node.feedbackR.value * 100);
              adt.delay.feedbackRNumbox.value = Math.trunc(adt.delay.node.feedbackR.value * 100);
              adt.delay.dryMixLDial.value = Math.trunc(adt.delay.node.dryMixL.value * 100);
              adt.delay.dryMixLNumbox.value = Math.trunc(adt.delay.node.dryMixL.value * 100);
              adt.delay.dryMixRDial.value = Math.trunc(adt.delay.node.dryMixR.value * 100);
              adt.delay.dryMixRNumbox.value = Math.trunc(adt.delay.node.dryMixR.value * 100);
              adt.delay.wetMixLDial.value = Math.trunc(adt.delay.node.wetMixL.value * 100);
              adt.delay.wetMixLNumbox.value = Math.trunc(adt.delay.node.wetMixL.value * 100);
              adt.delay.wetMixRDial.value = Math.trunc(adt.delay.node.wetMixR.value * 100);
              adt.delay.wetMixRNumbox.value = Math.trunc(adt.delay.node.wetMixR.value * 100);
            }

            return adt.delay;
        };

        return DelayCtrl;
    });
})();
