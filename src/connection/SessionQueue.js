const SessionQueue = {
    queue: {},
    addSession: function (key) {
        if (!key) { return; }
        this.queue[key] = Date.now();
        return this.queue[key];
    },
    addSessionWithValue: function (key, value) {
        if (!key) { return; }
        this.queue[key] = value;
    },
    isLatestSession: function (key, value) {
        if (!key) { return; }
        if (!this.queue[key]) { return true; }
        return value === this.queue[key];
    },
};

export default SessionQueue;
