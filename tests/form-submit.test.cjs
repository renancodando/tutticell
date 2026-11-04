const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const logic=require('../logic.js');
function setup(valid=true){
  const nodes=new Map(),navigations=[];let openedDialog=false;
  function node(selector){if(!nodes.has(selector))nodes.set(selector,{value:'',events:{},querySelectorAll(){return [];},addEventListener(type,fn){this.events[type]=fn;},setAttribute(){},replaceChildren(){},reportValidity(){return valid;},focus(){},showModal(){openedDialog=true;},classList:{add(){},remove(){},toggle(){}}});return nodes.get(selector);}
  const data={name:'João & Maria',brand:'Samsung',model:'Galaxy A54 / 5G',problem:'Tela',description:'Caiu e ficou com manchas + falha no toque.'};
  const context={window:{TutticellLogic:logic,location:{assign(url){navigations.push(url);}}},document:{querySelector:node,querySelectorAll:()=>[],addEventListener(){}},FormData:class{*[Symbol.iterator](){yield*Object.entries(data);}},setInterval(){},setTimeout(){},clearTimeout(){},Date};
  vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../app.js'),'utf8'),context);
  return{submit(){node('#quote-form').events.submit({preventDefault(){}});},navigations,data,dialogOpened:()=>openedDialog};
}
test('formulário abre WhatsApp diretamente com todos os dados e sem janela intermediária',()=>{const page=setup();page.submit();assert.equal(page.navigations.length,1);const url=new URL(page.navigations[0]);assert.equal(url.hostname,'wa.me');assert.equal(url.pathname,'/5519999244949');for(const value of Object.values(page.data))assert.ok(url.searchParams.get('text').includes(value));assert.equal(page.dialogOpened(),false);});
test('formulário inválido não navega para o WhatsApp',()=>{const page=setup(false);page.submit();assert.equal(page.navigations.length,0);});
