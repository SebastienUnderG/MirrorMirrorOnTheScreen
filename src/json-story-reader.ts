

// ...(groupe clé , callback)


if (Object.keys(story).includes('init')) {
    Object.keys(story.init).forEach(e => element(e, story.init));
} else {
    console.log('Missing init KEYS');
}

function element(key, context) {

    if (key === "message") {
        Object.keys(context.message).forEach(k => console.log(k + " -> " + context.message[k]));
        // Object.keys(context.message).forEach(k => io.emit(k, context.message[k]));
    } else if (key === "log") {
        Object.keys(context.log).forEach(k => console.log(k + " -> " + context.log[k]));
    } else if (key === "activity") {
        if (context.activity.up) {
            lastActivity(true);
        } else {
            idletime = context.activity.idle;
        }
    } else if (key === "input") {
        Object.keys(context.input).forEach(i => {
            if (context.input[i].length === undefined) {
                button[i].unwatch();
                button[i].watch(function (err, value) {
                    const buttonContext = context.input[i];
                    if (value == "1") {
                        Object.keys(buttonContext).forEach(e => element(e, buttonContext));
                    }
                });
            } else {
                button['buttonA'].unwatch();
                button['buttonB'].unwatch();
                button['buttonC'].unwatch();
                button['buttonD'].unwatch();
                button[i].watch(function (err, value) {
                    const buttonContext = context.input[i];
                    if (value == "1") {
                        Object.keys(story[buttonContext]).forEach(e => element(e, story[buttonContext]));
                    }
                });
            }
        });
    } else if (key === "action") {


    }
}
