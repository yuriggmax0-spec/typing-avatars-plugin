/**
 * Compat helper to require/find modules across different Vendetta-like forks
 * Tries common package names: @vendetta/metro, @metro, vendetta/metro, metro
 */
function tryRequire(names){
  for(const n of names){
    try{
      // eslint-disable-next-line no-undef
      const m = require(n);
      if(m) return m;
    }catch(e){}
  }
  return null;
}

const VendettaMetro = tryRequire(["@vendetta/metro","@metro","vendetta/metro","metro"]);
const VendettaUi = tryRequire(["@vendetta/ui","@ui","vendetta/ui","ui"]);
const VendettaUtils = tryRequire(["@vendetta/utils","@utils","vendetta/utils","utils"]);

// index.js - plugin entry
const { patch } = (function(){
  try { return require("@vendetta/patcher"); } catch(e){}
  try { return require("patcher"); } catch(e){}
  return null;
})() || { after: ()=>{}, unpatchAll: ()=>{} };

const find = (function(){
  try { return require("@vendetta/metro").find; } catch(e){}
  try { return require("@metro").find; } catch(e){}
  try { return require("metro").find; } catch(e){}
  return null;
})();

const React = (function(){ try { return require("react"); } catch(e) { return null; }})();

let unpatch = null;

module.exports = {
  onLoad(){
    try{
      // Try to find ChannelHeader (some forks name it differently)
      const finder = tryRequire(["@vendetta/metro","@metro","metro"]) || {};
      const findByName = (finder.findByName || (finder.find && finder.findByName));
      const ChannelHeader = findByName ? findByName("ChannelHeader", false) : null;

      if(!ChannelHeader){
        // fallback: try to patch MessageHeader or Header
        const fallback = findByName ? findByName("MessageHeader", false) : null;
        if(fallback) unpatch = patch.after("default", fallback, (args, res) => res);
        return;
      }

      unpatch = patch.after("default", ChannelHeader, ([props], res) => {
        try{
          const TypingAvatars = require("./components/TypingAvatars").default;
          // try to insert into channel header children safely
          const ch = props.channel || props;
          if(!ch) return res;
          // append near the right side or inside children array
          // Many header implementations expose children.props.children as an array
          try{
            const container = res.props?.children?.props?.children;
            if(Array.isArray(container)){
              container.push(React.createElement(TypingAvatars, { channel: ch }));
            } else if(res.props && res.props.children && !Array.isArray(res.props.children)){
              // replace single child with fragment
              res.props.children = [res.props.children, React.createElement(TypingAvatars, { channel: ch })];
            }
          }catch(e){
            // last resort: attach to props.right
            res.props.right = res.props.right || [];
            if(Array.isArray(res.props.right)) res.props.right.push(React.createElement(TypingAvatars, { channel: ch }));
            else res.props.right = React.createElement("div", null, res.props.right, React.createElement(TypingAvatars, { channel: ch }));
          }
        }catch(e){}
        return res;
      });
    }catch(e){
      console.error("TypingAvatars onLoad error", e);
    }
  },

  onUnload(){
    try{
      if(unpatch && typeof unpatch === "function") unpatch();
      if(patch && patch.unpatchAll) patch.unpatchAll();
    }catch(e){}
  }
};
