(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1a6b7531"],{"1f4f":function(t,e,a){"use strict";a("a9e3");var s=a("5530"),i=(a("8b37"),a("80d2")),n=a("7560"),r=a("58df");e["a"]=Object(r["a"])(n["a"]).extend({name:"v-simple-table",props:{dense:Boolean,fixedHeader:Boolean,height:[Number,String]},computed:{classes:function(){return Object(s["a"])({"v-data-table--dense":this.dense,"v-data-table--fixed-height":!!this.height&&!this.fixedHeader,"v-data-table--fixed-header":this.fixedHeader,"v-data-table--has-top":!!this.$slots.top,"v-data-table--has-bottom":!!this.$slots.bottom},this.themeClasses)}},methods:{genWrapper:function(){return this.$slots.wrapper||this.$createElement("div",{staticClass:"v-data-table__wrapper",style:{height:Object(i["g"])(this.height)}},[this.$createElement("table",this.$slots.default)])}},render:function(t){return t("div",{staticClass:"v-data-table",class:this.classes},[this.$slots.top,this.genWrapper(),this.$slots.bottom])}})},"615b":function(t,e,a){},"6d85":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",[a("v-chip",{staticClass:"ma-4",attrs:{large:"",color:"rgba(236, 128, 141, 0.498039215686275)"}},[a("div",{staticClass:"text-h4 px-8"},[t._v(t._s(t.type)+" 25%")])]),a("v-card",{staticClass:"ma-4"},[a("v-card-title",[t._v("已達成")]),a("v-card-text",[a("v-simple-table",{scopedSlots:t._u([{key:"default",fn:function(){return[a("tbody",t._l(t.reached,(function(e){return a("tr",{key:e.name},[a("td",[t._v(t._s(e.name))]),a("td",[t._v("經驗值 "+t._s(e.exp))])])})),0)]},proxy:!0}])})],1)],1),a("v-card",{staticClass:"ma-4"},[a("v-card-title",[t._v("未達成")]),a("v-card-text",[a("v-simple-table",{scopedSlots:t._u([{key:"default",fn:function(){return[a("tbody",t._l(t.notyet,(function(e){return a("tr",{key:e.name},[a("td",[t._v(t._s(e.name))]),a("td",[a("v-btn",[t._v("如何促進發展")])],1)])})),0)]},proxy:!0}])})],1)],1)],1)},i=[],n={props:{type:String},data:function(){return{reached:[{name:"仰躺時雙手手掌均能自然地張開",exp:1},{name:"仰躺時雙手會在胸前互相靠近",exp:1},{name:"面對面時能持續注視人臉，表現出對人的興趣",exp:1}],notyet:[{name:"能單手伸出碰到眼前15公分的玩具"},{name:"會轉頭尋找左後方和右後方的手搖鈴聲"},{name:"會重複地做搖的動作讓玩具發出聲音"}]}}},r=n,c=a("2877"),l=a("6544"),o=a.n(l),d=a("8336"),h=a("b0af"),u=a("99d9"),p=a("cc20"),v=a("a523"),b=a("1f4f"),f=Object(c["a"])(r,s,i,!1,null,null,null);e["default"]=f.exports;o()(f,{VBtn:d["a"],VCard:h["a"],VCardText:u["b"],VCardTitle:u["c"],VChip:p["a"],VContainer:v["a"],VSimpleTable:b["a"]})},"8adc":function(t,e,a){},"8b37":function(t,e,a){},"99d9":function(t,e,a){"use strict";a.d(e,"a",(function(){return n})),a.d(e,"b",(function(){return c})),a.d(e,"c",(function(){return l}));var s=a("b0af"),i=a("80d2"),n=Object(i["i"])("v-card__actions"),r=Object(i["i"])("v-card__subtitle"),c=Object(i["i"])("v-card__text"),l=Object(i["i"])("v-card__title");s["a"]},b0af:function(t,e,a){"use strict";a("0481"),a("4069"),a("a9e3");var s=a("5530"),i=(a("615b"),a("10d2")),n=a("297c"),r=a("1c87"),c=a("58df");e["a"]=Object(c["a"])(n["a"],r["a"],i["a"]).extend({name:"v-card",props:{flat:Boolean,hover:Boolean,img:String,link:Boolean,loaderHeight:{type:[Number,String],default:4},raised:Boolean},computed:{classes:function(){return Object(s["a"])(Object(s["a"])({"v-card":!0},r["a"].options.computed.classes.call(this)),{},{"v-card--flat":this.flat,"v-card--hover":this.hover,"v-card--link":this.isClickable,"v-card--loading":this.loading,"v-card--disabled":this.disabled,"v-card--raised":this.raised},i["a"].options.computed.classes.call(this))},styles:function(){var t=Object(s["a"])({},i["a"].options.computed.styles.call(this));return this.img&&(t.background='url("'.concat(this.img,'") center center / cover no-repeat')),t}},methods:{genProgress:function(){var t=n["a"].options.methods.genProgress.call(this);return t?this.$createElement("div",{staticClass:"v-card__progress",key:"progress"},[t]):null}},render:function(t){var e=this.generateRouteLink(),a=e.tag,s=e.data;return s.style=this.styles,this.isClickable&&(s.attrs=s.attrs||{},s.attrs.tabindex=0),t(a,this.setBackgroundColor(this.color,s),[this.genProgress(),this.$slots.default])}})},cc20:function(t,e,a){"use strict";a("4de4"),a("4160");var s=a("3835"),i=a("5530"),n=(a("8adc"),a("58df")),r=a("0789"),c=a("9d26"),l=a("a9ad"),o=a("4e82"),d=a("7560"),h=a("f2e7"),u=a("1c87"),p=a("af2b"),v=a("d9bd");e["a"]=Object(n["a"])(l["a"],p["a"],u["a"],d["a"],Object(o["a"])("chipGroup"),Object(h["b"])("inputValue")).extend({name:"v-chip",props:{active:{type:Boolean,default:!0},activeClass:{type:String,default:function(){return this.chipGroup?this.chipGroup.activeClass:""}},close:Boolean,closeIcon:{type:String,default:"$delete"},disabled:Boolean,draggable:Boolean,filter:Boolean,filterIcon:{type:String,default:"$complete"},label:Boolean,link:Boolean,outlined:Boolean,pill:Boolean,tag:{type:String,default:"span"},textColor:String,value:null},data:function(){return{proxyClass:"v-chip--active"}},computed:{classes:function(){return Object(i["a"])(Object(i["a"])(Object(i["a"])(Object(i["a"])({"v-chip":!0},u["a"].options.computed.classes.call(this)),{},{"v-chip--clickable":this.isClickable,"v-chip--disabled":this.disabled,"v-chip--draggable":this.draggable,"v-chip--label":this.label,"v-chip--link":this.isLink,"v-chip--no-color":!this.color,"v-chip--outlined":this.outlined,"v-chip--pill":this.pill,"v-chip--removable":this.hasClose},this.themeClasses),this.sizeableClasses),this.groupClasses)},hasClose:function(){return Boolean(this.close)},isClickable:function(){return Boolean(u["a"].options.computed.isClickable.call(this)||this.chipGroup)}},created:function(){var t=this,e=[["outline","outlined"],["selected","input-value"],["value","active"],["@input","@active.sync"]];e.forEach((function(e){var a=Object(s["a"])(e,2),i=a[0],n=a[1];t.$attrs.hasOwnProperty(i)&&Object(v["a"])(i,n,t)}))},methods:{click:function(t){this.$emit("click",t),this.chipGroup&&this.toggle()},genFilter:function(){var t=[];return this.isActive&&t.push(this.$createElement(c["a"],{staticClass:"v-chip__filter",props:{left:!0}},this.filterIcon)),this.$createElement(r["b"],t)},genClose:function(){var t=this;return this.$createElement(c["a"],{staticClass:"v-chip__close",props:{right:!0,size:18},on:{click:function(e){e.stopPropagation(),e.preventDefault(),t.$emit("click:close"),t.$emit("update:active",!1)}}},this.closeIcon)},genContent:function(){return this.$createElement("span",{staticClass:"v-chip__content"},[this.filter&&this.genFilter(),this.$slots.default,this.hasClose&&this.genClose()])}},render:function(t){var e=[this.genContent()],a=this.generateRouteLink(),s=a.tag,n=a.data;n.attrs=Object(i["a"])(Object(i["a"])({},n.attrs),{},{draggable:this.draggable?"true":void 0,tabindex:this.chipGroup&&!this.disabled?0:n.attrs.tabindex}),n.directives.push({name:"show",value:this.active}),n=this.setBackgroundColor(this.color,n);var r=this.textColor||this.outlined&&this.color;return t(s,this.setTextColor(r,n),e)}})}}]);
//# sourceMappingURL=chunk-1a6b7531.ab782a49.js.map