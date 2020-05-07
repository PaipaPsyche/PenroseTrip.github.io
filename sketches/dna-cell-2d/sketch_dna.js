
// 9  2  3
// 8  1  4
// 7  6  5


// PARAMS

ATTS = {
  running : 0,
  gen :1,
  max_gen:15,
  neigh_check : [1,2,3,4,5,6,7,8,9],
  n_side :80,
  rect_cells : {
    xo:30,
    yo:40,
    w:500
  },
  rule:{
    raw:"",
    enconded:""
  },
  mode:"cases",
  orders:[],

  fr:60
}

//CONSTANTS

INDEX = {
  1: [0,0],
  2: [0,-1],
  3: [1,-1],
  4: [1,0],
  5: [1,1],
  6: [0,1],
  7: [-1,1],
  8: [-1,0],
  9: [-1,-1]
}

CHARS = {
  blank:"#",
  sep:"-"
}

COLORS={
  0:[20,20,20],
  1:[250,225,0]
}

VECINITY_COLORS={
  0:[120,0,20],
  1:[250,10,0],
  2:[250,160,5],
  3:[150,240,15],
  4:[15,250,180],
  5:[5,150,220],
  6:[0,80,250],
  7:[80,0,230],
  8:[230,0,180]
}

//VARIABLES
let W;
let H;


let rule_code="";
let CELLS = [];
let COMBS =[];
let INDEXED ={};
let dna;
let gene_edit;
let butt_order;
let butt_mode;
let butt_load;
let butt_save;
let butt_clear;

let clickable=[];

//FUNCTIONS





function setup(){
  W = windowWidth;
  H = windowHeight;
  createCanvas(W,H);

  frameRate(ATTS.fr)
  //ATTS set
  ATTS.rect_cells.dx = ATTS.rect_cells.w/ATTS.n_side;

  gen_random_rule("0");

  for(let i = 0;i<ATTS.n_side;i++){
    CELLS[i]=[]
    for(let j = 0;j<ATTS.n_side;j++){
      CELLS[i][j] = new Cell(i,j,0);
    }
  }

  blank_center()
  create_combs()
  make_buttons()




  gene_edit=new gene_editor(600,350)
  clickable=[butt_load,butt_mode,butt_order,butt_save,gene_edit,butt_clear]

}


function gen_random_rule(mode="r"){
  rule_code="";
  for(let i =0;i<511;i++){
    if(mode=="r"){rule_code+=random(["1","0"]);}
    if(mode=="1"){rule_code+="1";}
    if(mode=="0"){rule_code+="0";}

  }
  rule_code="0"+rule_code

  update_on_dna()
}



function read_orders(){

  if(ATTS.orders.length >0 && ATTS.mode=="vecinity"){
    console.log("readorders")
    let new_indexed = {}


      let keys = Object.keys(INDEXED);
    for(let k of keys){
      let val = evaluate_vecinity_key(k);
      if(val){
        new_indexed[k]=val;

      }else{
        new_indexed[k]=INDEXED[k]
      }

    }
    INDEXED = new_indexed;

    keys = Object.keys(COMBS);
    for(let k of keys){
      let kk = int(k)
      let key = COMBS[kk]
      let res = new_indexed[key]
      if(int(rule_code[kk])!=int(res)){

        change_gene(kk,res)
      }

    }
  }
  update_on_dna()
  clear_orders()
}



function evaluate_vecinity_key(key){
  if(key.length!=9){
    console.log("evaluate vec.: not adecuate length - ",key)
    return;
  }
    let neighbors = 0;
    for(let i=1;i<key.length;i++){
      neighbors+=int(key[i])
    }
      for(let ord of ATTS.orders){
        //both inclusive
        let mp_i = ord.mp_i
        let mp_f = ord.mp_f

        if(neighbors>= mp_i && neighbors<=mp_f){
          if(ord.order =="survive" && str(key[0])=="1"){
              return 1;
          }else if(ord.order=="die"){
            return 0;
          }else if(ord.order=="born" && str(key[0])=="0"){
            return 1;
          }
        }

      }
}



function update_on_dna(){
  ATTS.rule.raw = rule_code;
  ATTS.rule.encoded = hiper_encode_rule(rule_code);
  dna = new dna_string(rule_code);
  create_combs()
}



function change_gene(pos,val){
  console.log("changed gene "+pos)
  console.log("---before "+rule_code[pos])
    rule_code = rule_code.slice(0,pos)+str(val)+rule_code.slice(pos+1,rule_code.length);
    console.log("---after "+rule_code[pos])
    update_on_dna()
}


function save_genome(){
  prompt("Copy the genome", ATTS.rule.encoded);
}

function load_genome(){
  var rule = prompt("Specify the new genome",'');
  set_rule(rule)
}


function mutate_random_gene(){

  let pos = 1+floor(random(rule_code.length-1)); // no instant emergence (full 0 state cant arise 1)
  console.log("changed gene "+pos)
  console.log("---before "+rule_code[pos])
  let putvalue =  rule_code[pos]=="1"?"0":"1";
  change_gene(pos,putvalue)
  console.log("---after "+rule_code[pos])



}

function create_combs(){
  let baseN = Combinatorics.baseN(['0','1'], ATTS.neigh_check.length);
  let combs = baseN.toArray();

  let ans = {};
  let indexed = {};
  for(let i=0;i<combs.length;i++){
    ans[i]=combs[i].join('')
    indexed[combs[i].join('')]=int(rule_code[i])
  }
  COMBS = ans;
  INDEXED = indexed;
}


function set_rule(rule){
  if(rule.length==512 && tell_unique(rule).length<=2 && (rule.includes("1") || rule.includes("0"))){
    rule_code=rule;
  }else if(rule.split("-").length==16){
    rule_code=hiper_decode_rule(rule)
  }else if(Object.keys(genomes).indexOf(rule)>=0){
    rule_code=hiper_decode_rule(genomes[rule])
  }else{
    console.log("unable to identify rule form")
  }
  update_on_dna()


}

function tell_unique(nonUnique){
  var unique = nonUnique.split('').filter(function(item, i, ar){ return ar.indexOf(item) === i; }).join('');
  return unique;
}

function make_buttons(){
 let xo = 35
 let yo = ATTS.rect_cells.w+60;

  //maxgen
  slider_mg = createSlider(5,1000,50,5);
  slider_mg.position(xo, yo);
  slider_mg.style('width', str(ATTS.rect_cells.w)+'px');
  slider_mg.style('height', '2px');
  //slider_mg.style('rotate', '-90');
  slider_mg.style('background-color', 'black');


  radio = createRadio();
  radio.option('cases');
  radio.option('vecinity');
  radio.style('width', '160px');
  radio.style('color', 'white');
  radio.value("cases");
  fill(255, 0, 0);
  radio.position(550,340)



  radio_g = createRadio();
  radio_g.option('Limited');
  radio_g.option('Infinite');
  radio_g.style('width', '160px');
  radio_g.style('color', 'white');
  radio_g.value("Limited");
  fill(255, 0, 0);
  radio_g.position(550,425)


  // A cell that has _ to _ neighbors must ___.;



  sel_b1 = createSelect();
  sel_b1.position(ATTS.rect_cells.xo+100, ATTS.rect_cells.w+75);
  for(let i=0;i<=8;i++){
  sel_b1.option(str(i));
  }
  sel_b1.selected('0');

  sel_b2 = createSelect();
  sel_b2.position(ATTS.rect_cells.xo+170, ATTS.rect_cells.w+75);
  for(let i=0;i<=8;i++){
  sel_b2.option(str(i));
  }
  sel_b2.selected('0');




  sel_o = createSelect();
  sel_o.position(ATTS.rect_cells.xo+305, ATTS.rect_cells.w+75);

  sel_o.option("die");
  sel_o.option("survive");
  sel_o.option("born");

  sel_o.selected("survive");

  butt_order = new button_do(ATTS.rect_cells.xo+405, ATTS.rect_cells.w+75,create_order)
  butt_mode = new button_do(550,365,set_mode,3,[250,250,250])


  butt_save = new button_do(550,295,save_genome,4,[0,250,100])
  butt_load = new button_do(620,295,load_genome,4,[250,250,20])
  butt_clear = new button_do(ATTS.rect_cells.xo+435, ATTS.rect_cells.w+75,clear_orders,4,[250,20,20])

}


function clear_orders(){ATTS.orders=[]}

function create_order(){
  //validate
  if((sel_b1.value()>sel_b2.value())){
    alert("Wrong parameters, try again.")
    return;
  }



  let order = {mp_i:sel_b1.value(),mp_f:sel_b2.value(),order:sel_o.value()}
  ATTS.orders.push(order);
console.log("A cell that has ",sel_b1.value()," to ",sel_b2.value()," neighbors must",sel_o.value())
}

function set_mode(){

  let mode = radio.value()
  if(mode!=ATTS.mode){
    ATTS.mode = mode;

  console.log("mode changed to ",mode);


  }
  read_orders();

}


function evaluate_cells(){

  let new_c = []

  for(let i = 0;i<ATTS.n_side;i++){
    new_c[i] = []
    for(let j = 0;j<ATTS.n_side;j++){
      new_c[i][j] = new Cell(i,j,0);
      let str = CELLS[i][j].read_state()
      new_c[i][j].set(translate_state(str))
    }
  }

  return new_c;
}

function random_switch(){
  random(random(CELLS)).switch()
}



function look_for(str){
  for(let i =0 ; i<Object.keys(COMBS).length;i++){
    if(str == COMBS[i]){
      return i;
    }
  }
}


function translate_state(str){

  return INDEXED[str];
}


function blank(){
  ATTS.gen=1;
  ATTS.running=0;
  for(let i = 0;i<ATTS.n_side;i++){
    for(let j = 0;j<ATTS.n_side;j++){
      CELLS[i][j].set(0);
    }
  }
}


function blank_center(){
  //blank()
  let mid = int(ATTS.n_side/2)
  CELLS[mid][mid].set(1)
}



function blank_border(dir){
  //blank()
  let mid = int(ATTS.n_side/2)
  for(let i = 0;i<ATTS.n_side;i++){

    if(dir=="h"){
      CELLS[i][mid].set(i%2)
    }
    else if(dir=="v"){
      CELLS[mid][i].set(i%2)
    }
    else if(dir=="a"){
      CELLS[ATTS.n_side-1-i][i].set(i%2)
    }
    else if(dir=="d"){
      CELLS[i][i].set(i%2)
    }

  }

}


function keyPressed(){
  if(key=="e"){
    evolve();
  }
  if(key=="r"){
    blank_center()
    gen_random_rule()
  }
  if(key=="m"){
      mutate_random_gene()
  }
  if(key=="p"){
      random_switch()
  }
  if(key=="c"){
    blank_center()
  }
  if(key=="b"){
    blank();
  }
  if(key=="0"){
    gen_random_rule("0")
  }
  if(key=="1"){
    gen_random_rule("1")
  }

  if(keyCode==SHIFT){
    gen_random_rule()
  }
  if(keyCode==ENTER){
    ATTS.running = 1-ATTS.running;
  }
  if(key=="h"){
    blank_border("h")
  }
  if(key=="v"){
    blank_border("v")
  }
  if(key=="d"){
    blank_border("d")
  }
  if(key=="a"){
    blank_border("a")
  }
}


function mouseClicked(){


  for(let c of clickable){
    c.click()
  }

  for(let i = 0;i<ATTS.n_side;i++){
    for(let j = 0;j<ATTS.n_side;j++){
      if(CELLS[i][j].mouseInRange()){
        CELLS[i][j].switch()
        return;
      }

    }
  }
}




function evolve(){
  CELLS =  evaluate_cells()
  ATTS.gen = ATTS.gen+1;
}




//MAIN LOOP
function draw(){
  background(0);

  fill(255)




  for(let i = 0;i<ATTS.n_side;i++){
    for(let j = 0;j<ATTS.n_side;j++){
      CELLS[i][j].paint();
    }
  }
  if(ATTS.running==1 && (radio_g.value()=="Infinite"||ATTS.gen < ATTS.max_gen)){
    evolve()
  }



  dna.paint(600,70,50,200)
  for(let c of clickable){
    c.paint()
  }
  ATTS.max_gen=slider_mg.value()

  if(ATTS.running==1){
    push()
    textAlign(LEFT)
    textSize(12)
    fill([0,180,0])
    text("Running",ATTS.rect_cells.xo+ATTS.rect_cells.w/2-80,30)
    pop()
  }else{
    push()
    textSize(12)
    fill([190,0,0])
    text("Stop",ATTS.rect_cells.xo+ATTS.rect_cells.w/2-80,30)
    pop()
  }




  push()
  textAlign(LEFT)
  textSize(16)
  let extra_txt = radio_g.value()=="Infinite"?"inf.":ATTS.max_gen;
  text("Generation : "+ATTS.gen+"/"+extra_txt,ATTS.rect_cells.xo,30)


  textSize(15)
  text("Mode",550,330)
  text("Max. Generations",550,410)
  text("Behavior Programation Module",550,470)




  textSize(13)

  text("Save            Load",565,300)
  text("Update  ("+ATTS.orders.length+" orders)",565,370)
  text("A cell that has               to               neghbors must",ATTS.rect_cells.xo, ATTS.rect_cells.w+80)


  stroke(255)
  line(550,310,700,310)
  line(550,385,700,385)
  line(550,455,700,455)
  pop()
}
