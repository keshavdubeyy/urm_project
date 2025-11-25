# Testing Dashboard Sync Feature

## How to Test if Syncing is Working

### Method 1: Check Browser Console (Recommended)

1. Open your browser and go to `http://localhost:3000/dashboard`
2. Open Developer Tools (F12 or Right-click → Inspect)
3. Go to the **Console** tab
4. You should see logs like:
   ```
   [Dashboard] Starting manual fetch...
   [Dashboard] Data loaded: 4 responses
   [Dashboard] Response IDs: [...]
   [Dashboard] State updated successfully
   [Dashboard] Fetch complete
   ```

5. **To test manual sync:**
   - Click the "Sync Data" button
   - Watch the console for `[Dashboard] Manual refresh clicked`
   - Check if new data appears

6. **To test auto-refresh:**
   - Enable the "Auto-refresh (30s)" checkbox
   - Watch for `[Dashboard] Auto-refresh enabled - will check every 30 seconds`
   - Wait 30 seconds and look for `[Dashboard] Auto-refresh triggered`

### Method 2: Test with Real Data Changes

1. **Add a new response in Supabase:**
   - Go to Supabase Dashboard → Table Editor → survey_responses
   - Add a test row manually
   
2. **On the dashboard:**
   - Note the current "Total Responses" count (top left card)
   - Click "Sync Data" button
   - The count should update immediately
   - Check "Last updated" timestamp changes

3. **Test auto-refresh:**
   - Enable auto-refresh checkbox
   - Add another row in Supabase
   - Wait up to 30 seconds
   - The dashboard should update automatically

### Method 3: Network Tab Monitoring

1. Open Developer Tools → **Network** tab
2. Filter by "dashboard" 
3. Click "Sync Data" button
4. You should see:
   - New request to `/api/dashboard`
   - Status: 200
   - Response shows current data

### What to Look For

**Working correctly:**
- ✅ Console shows fetch logs
- ✅ "Last updated" timestamp changes when syncing
- ✅ Response count updates with new data
- ✅ "Syncing..." appears briefly when clicking sync button
- ✅ "Checking for updates..." shows during auto-refresh

**Not working:**
- ❌ No console logs appear
- ❌ "Last updated" doesn't change
- ❌ Count stays the same even after adding data
- ❌ Network tab shows no new requests
- ❌ Error messages in console

### Debug Commands

**Check API directly:**
```bash
curl http://localhost:3000/api/dashboard | jq
```

**Check current response count:**
```bash
curl -s http://localhost:3000/api/dashboard | grep -o '"count":[0-9]*'
```

**Watch for auto-refresh (keep this running):**
```bash
# In one terminal, run the dev server
npm run dev

# In another terminal, monitor API calls
watch -n 5 'curl -s http://localhost:3000/api/dashboard | jq .count'
```

### Common Issues

**Issue: Button doesn't respond**
- Check browser console for errors
- Make sure dev server is running
- Check if JavaScript is enabled

**Issue: Auto-refresh not triggering**
- Verify checkbox is checked
- Look for console message: `[Dashboard] Auto-refresh enabled`
- Wait full 30 seconds for first trigger
- Check browser console for timer logs

**Issue: Data not updating**
- Verify Supabase credentials in `.env`
- Check API endpoint returns data: `curl localhost:3000/api/dashboard`
- Look for errors in server terminal
- Check Network tab for failed requests

### Quick Verification Script

Run this in your terminal to continuously monitor:

```bash
#!/bin/bash
echo "Monitoring dashboard API calls..."
echo "Add data to Supabase and watch the count change"
echo ""

while true; do
  COUNT=$(curl -s http://localhost:3000/api/dashboard | grep -o '"count":[0-9]*' | cut -d: -f2)
  echo "$(date '+%H:%M:%S') - Current responses: $COUNT"
  sleep 5
done
```

Save as `monitor.sh`, make executable with `chmod +x monitor.sh`, then run `./monitor.sh`
