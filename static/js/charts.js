// charts.js

// Add event listener for the search button
document.getElementById('search-btn').addEventListener('click', fetchAndRenderData);

// Automatically fetch data when the page loads
document.addEventListener('DOMContentLoaded', fetchAndRenderData);

function showNoDataMessage() {
    let msg = document.getElementById('no-data-msg');
    if (!msg) {
        msg = document.createElement('div');
        msg.id = 'no-data-msg';
        msg.className = 'text-center text-lg text-red-600 font-semibold my-8 p-6 bg-red-50 border border-red-200 rounded-xl';
        msg.innerHTML = `
            <div class="flex items-center justify-center mb-2">
                <svg class="w-8 h-8 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <span>No flight data found for your selection</span>
            </div>
            <p class="text-sm text-red-700">Try selecting different dates or city combinations.</p>
        `;
        document.querySelector('#charts').before(msg);
    }
    msg.style.display = '';
}
function hideNoDataMessage() {
    const msg = document.getElementById('no-data-msg');
    if (msg) msg.style.display = 'none';
}

// Update the fetchAndRenderData function
async function fetchAndRenderData() {
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const today = new Date().toISOString().split('T')[0]; // Always use today's date
    
    try {
        const response = await fetch(`/api/data?origin=${origin}&destination=${destination}&start=${today}`);
        const data = await response.json();
        const isEmpty = (!data.top_routes || !data.top_routes.length) && (!data.price_trends || !data.price_trends.length) && (!data.table_data || !data.table_data.length);
        if (isEmpty) {
            showNoDataMessage();
        } else {
            hideNoDataMessage();
        }
        renderBarChart(data.top_routes || []);
        renderLineChart(data.price_trends || []);
        renderTable(data.table_data || []);
    } catch (err) {
        showNoDataMessage();
        renderBarChart([]);
        renderLineChart([]);
        renderTable([]);
    }
}

function renderBarChart(data) {
    if (!data.length) {
        Plotly.newPlot('bar-chart', [{
            x: [], 
            y: [], 
            type: 'bar', 
            marker: {color: '#0ea5e9'}
        }], {
            title: 'Top 5 Popular Routes',
            font: {family: 'Inter, sans-serif'},
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            margin: {t: 40, b: 40, l: 60, r: 20}
        });
        return;
    }
    Plotly.newPlot('bar-chart', [{
        x: data.map(row => row[0]),
        y: data.map(row => row[1]),
        type: 'bar',
        marker: {
            color: '#0ea5e9',
            line: {color: '#0284c7', width: 1}
        }
    }], {
        title: 'Top 5 Popular Routes',
        font: {family: 'Inter, sans-serif'},
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: {t: 40, b: 40, l: 60, r: 20}
    });
}

function renderLineChart(data) {
    if (!data.length) {
        Plotly.newPlot('line-chart', [{
            x: [], 
            y: [], 
            type: 'scatter', 
            mode: 'lines+markers', 
            line: {color: '#6366f1'},
            marker: {color: '#6366f1'}
        }], {
            title: 'Average Price Trends',
            font: {family: 'Inter, sans-serif'},
            plot_bgcolor: 'rgba(0,0,0,0)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            margin: {t: 40, b: 40, l: 60, r: 20}
        });
        return;
    }
    Plotly.newPlot('line-chart', [{
        x: data.map(row => row[0]),
        y: data.map(row => row[1]),
        type: 'scatter',
        mode: 'lines+markers',
        line: {
            color: '#6366f1',
            width: 3
        },
        marker: {
            color: '#6366f1',
            size: 8,
            line: {color: '#4f46e5', width: 2}
        }
    }], {
        title: 'Average Price Trends',
        font: {family: 'Inter, sans-serif'},
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: {t: 40, b: 40, l: 60, r: 20}
    });
}

function renderTable(data) {
    const table = document.getElementById('data-table');
    if (!data.length) {
        table.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-8 text-center text-slate-500">
                    <div class="flex flex-col items-center">
                        <svg class="w-12 h-12 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        <span class="text-lg font-medium">No data available</span>
                        <span class="text-sm">Try adjusting your search criteria</span>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    table.innerHTML = data.map(row => `
        <tr class="hover:bg-slate-50 transition-colors duration-200">
            <td class="px-6 py-4 text-sm font-medium text-slate-900">${row.route || ''}</td>
            <td class="px-6 py-4 text-sm text-slate-600">${row.date_time || ''}</td>
            <td class="px-6 py-4 text-sm text-slate-600">${row.airline || ''}</td>
            <td class="px-6 py-4 text-sm text-slate-600">${row.flight_number || ''}</td>
            <td class="px-6 py-4">
                <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    row.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                    row.status === 'delayed' ? 'bg-yellow-100 text-yellow-800' :
                    row.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-slate-100 text-slate-800'
                }">
                    ${row.status || 'Unknown'}
                </span>
            </td>
        </tr>
    `).join('');
}