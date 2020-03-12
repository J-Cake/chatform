export default function (vars: {
    time: Date,
    sender: string,
    userName: string,
    content: number[]
}) {
    return `<div class="message">
    <div class="message-header">
        <span class="sender">${vars.userName}</span>
        <span class="time">${
        (function () {

            const diff = (date1, date2) => Math.ceil(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

            const dateDiff = diff(vars.time, new Date());

            if (dateDiff <= 1) {// message is from today
                const mins = new Date().getMinutes() - vars.time.getMinutes();
                const hours = new Date().getHours() - vars.time.getHours();

                if (mins < 1 && hours < 1)
                    return "Just Then";
                else if (hours <= 1)
                    return `${mins} ${mins === 1 ? "minute" : "minutes"} ago`;
                else if (hours <= 6)
                    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
                else
                    return `Today, ${vars.time.toLocaleTimeString()}`;
            } else if (dateDiff <= 2)
                return `Yesterday, ${vars.time.toLocaleTimeString()}`;
            else if (dateDiff <= 7) {
                const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

                return `${days[days.length % (dateDiff + new Date().getDay() + 1)]}, ${vars.time.toLocaleTimeString()}`;
            } else
                return vars.time.toLocaleString();
        })()
    }</span>
    </div>
    <div class="message-content">
        <div class="prof-pic">
            <object data="/api/image/${vars.sender}" type="image/png">
                <img src="/res/user.svg" alt="No Picture"/>
            </object>
        </div>
        <div class="message-body">
            ${vars.content.map(i => String.fromCodePoint(i)).join('')}
        </div>
    </div>
</div>`;
};