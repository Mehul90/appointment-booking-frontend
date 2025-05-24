const Loader = ({ loaderColor }) => {
    return <div class={`w-4 h-4 border-2 border-t-white ${loaderColor ? loaderColor : "border-[rgba(247,237,237,0.1)]"} border-solid rounded-full animate-spin mx-auto`} />

};

export default Loader;
