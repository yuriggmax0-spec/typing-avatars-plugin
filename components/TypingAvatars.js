
const find = (function(){ try{ return require("@vendetta/metro").find; }catch(e){ try{return require("@metro").find;}catch(e){return null;} }})();
const StyleSheet = (function(){ try{ return require("@vendetta/metro").stylesheet; }catch(e){ try{return require("@metro").stylesheet;}catch(e){return null;} }})();
const semanticColors = (function(){ try{ return require("@vendetta/ui").semanticColors; }catch(e){ try{return require("ui").semanticColors;}catch(e){return {};}} })();
const General = (function(){ try{ return require("@vendetta/ui").General; }catch(e){ try{return require("ui").General;}catch(e){return {};}} })();
const unfreeze = (function(){ try{ return require("@vendetta/utils").unfreeze; }catch(e){ try{return require("utils").unfreeze;}catch(e){ return (x)=>x; }} })();

const { Pressable } = General || {};
const SummarizedIconRow = (function(){ try{ return find.findByName("SummarizedIconRow", false).default; }catch(e){ try{ return find.findByName("SummarizedIconRow", false); }catch(e){ return null; }} })();
const AvatarType = (function(){ try{ return find.findByProps("AvatarSizes").default.type; }catch(e){ try{ return find.findByProps("AvatarSizes").default.type; }catch(e){ return null; }} })();

const { useTypingUserIds } = (function(){ try{ return find.findByProps("TYPING_WRAPPER_HEIGHT").useTypingUserIds; }catch(e){ try{ return find.findByProps("TYPING_WRAPPER_HEIGHT").useTypingUserIds; }catch(e){ return ()=>[]; }} })();

const UserStore = (function(){ try{ return find.findByStoreName("UserStore"); }catch(e){ try{ return require("@vendetta/metro").findByStoreName("UserStore"); }catch(e){ return { getUser: ()=>null }; }} })();

let AVATAR_SIZE_MAP = {};
try{
  const AvatarConstants = find.findByProps("AVATAR_SIZE_MAP");
  AVATAR_SIZE_MAP = unfreeze(AvatarConstants.AVATAR_SIZE_MAP || {});
  AVATAR_SIZE_MAP.size12 = 12;
}catch(e){}

const styles = (function(){
  try{
    return require("@vendetta/metro").stylesheet.createThemedStyleSheet({
      wrapper: {
        borderWidth: 2,
        borderRadius: 16,
        borderColor: semanticColors.BACKGROUND_SECONDARY,
        backgroundColor: semanticColors.BACKGROUND_SECONDARY
      }
    });
  }catch(e){
    return { wrapper: {} };
  }
})();

module.exports = function TypingAvatars({ channel }){
  const typingIds = useTypingUserIds ? useTypingUserIds(channel?.id) : [];
  const typingUsers = (typingIds || []).map(id => UserStore.getUser ? UserStore.getUser(id) : null).filter(Boolean);

  function renderAvatar(user){
    try{
      const Avatar = AvatarType || (props => null);
      return Avatar ? Avatar({ user, size: "size12", guildId: channel?.guild_id }) : null;
    }catch(e){ return null; }
  }

  return Pressable ? Pressable({ onPress: () => {
    try{ require("../sheets/TypingActionSheet").showTypingActionSheet(channel); }catch(e){}
  } }, 
    SummarizedIconRow ? SummarizedIconRow({
      iconWrapperStyle: styles.wrapper,
      items: typingUsers,
      max: 5,
      offsetAmount: -8,
      overflowComponent: require("./OverflowAvatar"),
      overflowStyle: styles.wrapper,
      style: { height: 16, paddingRight: 2 },
      renderItem: renderAvatar
    }) : null
  ) : null;
};
