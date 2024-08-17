let myChart = null;

function randomizeFlip() {
    const choices = [0, 1];
    const basicFlip = choices[Math.floor(Math.random() * choices.length)];
    const sumFlip = (Array.from({ length: 3 }, () => choices[Math.floor(Math.random() * choices.length)])).reduce((a, b) => a + b) % 2;
    const weightedFlip = choices[Math.floor(Math.random() * choices.length)];
    const oddEvenFlip = choices[Math.floor(Math.random() * choices.length)];
    return [basicFlip, sumFlip, weightedFlip, oddEvenFlip][Math.floor(Math.random() * 4)];
}

function nestedRandomization() {
    const results = [];
    for (let i = 0; i < Math.floor(Math.random() * 4) + 4; i++) {
        const innerResults = [];
        for (let j = 0; j < Math.floor(Math.random() * 96) + 5; j++) {
            innerResults.push(randomizeFlip());
        }
        const mostFrequent = innerResults.sort((a, b) =>
            innerResults.filter(v => v === a).length
            - innerResults.filter(v => v === b).length
        ).pop();
        results.push(mostFrequent);
    }
    return results.sort((a, b) =>
        results.filter(v => v === a).length
        - results.filter(v => v === b).length
    ).pop();
}

document.getElementById('submit-btn').addEventListener('click', () => {
    const numAttempts = parseInt(document.getElementById('numAttempts').value);

    if (numAttempts % 2 === 0 || isNaN(numAttempts)) {
        alert("Please enter a valid odd number.");
        return;
    }

    const userChoices = Array.from({ length: numAttempts }, () => Math.floor(Math.random() * 2));
    const result = nestedRandomization();
    const matchCount = userChoices.filter(choice => choice === result).length;
    const mismatchCount = numAttempts - matchCount;

    document.getElementById('flip-result').textContent = `The coin flip result is: ${matchCount > mismatchCount ? 'Heads' : 'Tails'}`;
    document.getElementById('summary').textContent = `Total Attempts: ${numAttempts}\nNumber of Heads: ${matchCount}\nNumber of Tails: ${mismatchCount}`;
    
    // Add pregnancy suggestion
    const suggestion = matchCount > mismatchCount 
        ? "The number of Heads exceeds the number of Tails, suggesting it's a good time for pregnancy."
        : "The number of Tails exceeds the number of Heads, suggesting it may not be the right time for pregnancy.";
    document.getElementById('pregnancy-suggestion').textContent = suggestion;

    // Show detailed flip logs
    // const flipLogs = userChoices.map((choice, index) => `Attempt ${index + 1}: ${choice === 1 ? 'Heads' : 'Tails'}`).join('\n');
    // document.getElementById('flip-logs').textContent = flipLogs;

    // Show pie chart for flip distribution
    const headsCount = userChoices.filter(choice => choice === 1).length;
    const tailsCount = userChoices.length - headsCount;

    // Destroy old chart if it exists
    if (myChart) {
        myChart.destroy();
    }

    const ctx = document.getElementById('flip-chart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Heads', 'Tails'],
            datasets: [{
                data: [headsCount, tailsCount],
                backgroundColor: ['#ff6384', '#36a2eb']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw}`;
                        }
                    }
                }
            }
        }
    });

    document.getElementById('result-section').style.display = 'block';
});
