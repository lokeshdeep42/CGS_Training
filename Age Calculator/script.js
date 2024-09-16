function calculateAge() {
    const calendarBox = document.getElementById('calendarBox').value;
    if (!calendarBox) {
        alert("Please enter your date of birth");
        return;
    }

    const birthDate = new Date(calendarBox);
    const currentDate = new Date();
    const diffInMs = currentDate - birthDate;

    if (diffInMs < 0) {
        alert("Please enter a valid date of birth");
        return;
    }

    const years = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30.44));
    const weeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));

    const remainingMonths = months - (years * 12);
    const remainingDays = days - (years * 365.25 + remainingMonths * 30.44);
    const remainingWeeks = Math.floor(remainingDays / 7);
    const remainingHours = hours - (years * 365.25 * 24 + remainingMonths * 30.44 * 24 + remainingDays * 24);

    document.getElementById('ageOutput').innerHTML = 
        `${years} years, ${remainingMonths} months, ${remainingWeeks} weeks, ${Math.floor(remainingDays)} days, and ${remainingHours} hours.`;
}
