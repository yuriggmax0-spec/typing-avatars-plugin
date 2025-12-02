
const { constants: Constants, stylesheet: StyleSheet } = (function(){
  try{ return require("@vendetta/metro").constants && require("@vendetta/metro").stylesheet ? require("@vendetta/metro") : {}; }catch(e){ return {}; }
})();
const semanticColors = (function(){ try{ return require("@vendetta/ui").semanticColors; }catch(e){ try{ return require("ui").semanticColors; }catch(e){ return {}; }} })();
const General = (function(){ try{ return require("@vendetta/ui").General; }catch(e){ try{ return require("ui").General; }catch(e){ return {}; }} })();

const View = General?.View || function(p){ return null; };
const Text = General?.Text || function(p){ return null; };

const styles = (function(){
  try{
    const ss = require("@vendetta/metro").stylesheet;
    return ss.createThemedStyleSheet({
      container: {
        height: 12,
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: semanticColors.BACKGROUND_TERTIARY,
      },
      text: {
        paddingHorizontal: 2,
        fontSize: 8,
        fontFamily: Constants?.Fonts?.PRIMARY_BOLD,
        color: semanticColors.INTERACTIVE_NORMAL
      }
    });
  }catch(e){
    return { container: {}, text: {} };
  }
})();

module.exports = function OverflowAvatar({ overflow, style }){
  return View ? (
    View({ style },
      View({ style: styles.container },
        Text({ style: styles.text }, "+" + overflow)
      )
    )
  ) : null;
};
