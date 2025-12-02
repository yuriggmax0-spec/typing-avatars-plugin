
const find = (function(){ try{ return require("@vendetta/metro").find; }catch(e){ try{return require("@metro").find;}catch(e){return null;} }})();
const getAssetIDByName = (function(){ try{ return require("@vendetta/ui").getAssetIDByName; }catch(e){ try{return require("ui").getAssetIDByName;}catch(e){ return ()=>null; }} })();
const Forms = (function(){ try{ return require("@vendetta/ui").Forms; }catch(e){ try{return require("ui").Forms;}catch(e){ return {}; }} })();
const General = (function(){ try{ return require("@vendetta/ui").General; }catch(e){ try{return require("ui").General;}catch(e){ return {}; }} })();
const Constants = (function(){ try{ return require("@vendetta/metro").constants; }catch(e){ return {}; }})();
const StyleSheet = (function(){ try{ return require("@vendetta/metro").stylesheet; }catch(e){ return {}; }})();
const semanticColors = (function(){ try{ return require("@vendetta/ui").semanticColors; }catch(e){ try{return require("ui").semanticColors;}catch(e){ return {}; }} })();

const LazyActionSheet = (function(){ try{ return find.findByProps("openLazy", "hideActionSheet"); }catch(e){ return null; }})();
const { FormRow, FormArrow } = Forms || {};
const { View, Image, Text } = General || {};
const ActionSheet = (function(){ try{ return find.findByProps("ActionSheet")?.ActionSheet ?? find.find(m => m.render?.name === "ActionSheet"); }catch(e){ return null; }})();
const BottomSheetScrollView = (function(){ try{ return find.findByProps("BottomSheetScrollView"); }catch(e){ return null; }})();
const ActionSheetTitleHeader = (function(){ try{ return find.findByProps("ActionSheetTitleHeader"); }catch(e){ return null; }})();
const AvatarType = (function(){ try{ return find.findByProps("AvatarSizes").default.type; }catch(e){ return null; }})();

const { useTypingUserIds } = (function(){ try{ return find.findByProps("TYPING_WRAPPER_HEIGHT"); }catch(e){ return { useTypingUserIds: ()=>[] }; }})();

const UserStore = (function(){ try{ return find.findByStoreName("UserStore"); }catch(e){ return { getUser: ()=>null }; }})();
const RelationshipStore = (function(){ try{ return find.findByStoreName("RelationshipStore"); }catch(e){ return {}; }})();
const GuildMemberStore = (function(){ try{ return find.findByStoreName("GuildMemberStore"); }catch(e){ return {}; }})();
const ThemeStore = (function(){ try{ return find.findByStoreName("ThemeStore"); }catch(e){ return { theme: "dark" }; }})();

const { showUserProfile } = (function(){ try{ return find.findByProps("showUserProfile"); }catch(e){ return {}; }})() || {};

function showTypingActionSheet(channel){
  try{
    if(LazyActionSheet && LazyActionSheet.openLazy){
      LazyActionSheet.openLazy(new Promise(r => r({ default: TypingActionSheet })), "TypingActionSheet", { channel });
      return;
    }
    // fallback: try to render directly (some forks expect components exported)
    // no-op fallback
  }catch(e){}
}

const styles = (function(){
  try{
    return StyleSheet.createThemedStyleSheet({
      text: {
        fontFamily: Constants.Fonts.PRIMARY_MEDIUM,
        fontSize: 16,
        lineHeight: 20,
        color: semanticColors.TEXT_MUTED,
        textAlign: "center",
        marginTop: 8
      }
    });
  }catch(e){
    return { text: {} };
  }
})();

function TypingActionSheet({ channel }){
  const typingIds = (useTypingUserIds && useTypingUserIds(channel?.id)) || [];
  const typingUsers = (typingIds || []).map(id => UserStore.getUser ? UserStore.getUser(id) : null).filter(Boolean);

  return ActionSheet ? ActionSheet({ scrollable: true },
    BottomSheetScrollView ? BottomSheetScrollView({ contentContainerStyle: { paddingBottom: 16 } },
      ActionSheetTitleHeader ? ActionSheetTitleHeader({ title: `Digitando em #${channel?.name || ""}` }) : null,
      (typingUsers.length ? typingUsers.map(user => FormRow ? FormRow({
        leading: AvatarType ? AvatarType({ user, size: "normal", guildId: channel?.guild_id }) : null,
        label: GuildMemberStore.getNick ? (GuildMemberStore.getNick(channel?.guild_id, user.id) || user.username) : (user.username),
        trailing: FormArrow ? FormArrow() : null,
        onPress: () => showUserProfile ? showUserProfile({ userId: user.id, channelId: channel.id }) : null
      }) : View ? View({ style: { paddingTop: 32, justifyContent: "center", alignItems: "center" } },
        Image ? Image({ source: getAssetIDByName(ThemeStore.theme === "light" ? "empty_channel_no_text_channels_light" : "empty_channel_no_text_channels_dark"), style: { width: 256, height: 128, resizeMode: "contain" } }) : null,
        Text ? Text({ style: styles.text }, "Ninguém está digitando agora.") : null
      ) : null))
    ) : null
  ) : null;
}

module.exports = { showTypingActionSheet, default: TypingActionSheet };
  
