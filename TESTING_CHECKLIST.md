# ✅ Survey Testing Checklist

## 🧪 Experimental Design Tests

### Test 1: Random Assignment Verification
- [ ] Load homepage 5 times in different browser windows
- [ ] Check console for different experimental conditions
- [ ] Verify you see both Order A and Order B assignments  
- [ ] Confirm both Paperclip=ObjectA and Brick=ObjectA assignments
- [ ] Expected: 4 different condition combinations

### Test 2: Task Flow Validation

#### Order A Test (No-AI → AI)
- [ ] Get assigned to Order A condition
- [ ] Verify Task 1 shows "Without AI" and correct object
- [ ] Complete Task 1 (1.5 min timer works)
- [ ] Task 1 Evaluation leads to Task 2
- [ ] Verify Task 2 shows "With AI" and alternate object  
- [ ] Complete Task 2 and evaluation
- [ ] Ends at Post-study page

#### Order B Test (AI → No-AI)  
- [ ] Get assigned to Order B condition
- [ ] Verify Task 1 shows "With AI" and correct object
- [ ] Complete Task 1 (1.5 min timer works)
- [ ] Task 1 Evaluation leads to Task 2
- [ ] Verify Task 2 shows "Without AI" and alternate object
- [ ] Complete Task 2 and evaluation  
- [ ] Ends at Post-study page

### Test 3: Object Assignment Validation
- [ ] Confirm Object A/B labels display correctly
- [ ] Verify Paperclip shows 📎 emoji
- [ ] Verify Brick shows 🧱 emoji  
- [ ] Task instructions update with correct object names
- [ ] Both objects appear across different participants

## 📝 Survey Content Tests

### Test 4: All Pages Load
- [ ] Homepage (consent form)
- [ ] Demographics page  
- [ ] Pre-task questionnaires
- [ ] Task instruction pages
- [ ] Task activity pages (timer functionality)
- [ ] Task experience pages (workload + experience)
- [ ] Post-study questionnaires
- [ ] Thank you confirmation

### Test 5: Form Validation
- [ ] Required fields show validation errors
- [ ] Age validation (18+ requirement)
- [ ] Likert scales work properly
- [ ] TLX sliders function correctly
- [ ] Text areas accept input
- [ ] Timer countdown displays

### Test 6: Data Collection
- [ ] Experimental condition saved to database
- [ ] All scale responses recorded
- [ ] Task timestamps captured
- [ ] Task text responses saved
- [ ] Final submission successful

## 🔌 Integration Tests

### Test 7: Database Connection
- [ ] Supabase connection established
- [ ] Survey responses table accessible
- [ ] Data writes successfully
- [ ] No connection errors in console

### Test 8: Google Sheets Integration  
- [ ] Service account authentication works
- [ ] Data appears in Google Sheet after submission
- [ ] All fields properly mapped
- [ ] Real-time sync functional

### Test 9: Navigation & UX
- [ ] Back buttons work correctly
- [ ] Progress indicator accurate
- [ ] Step titles update properly
- [ ] Mobile responsive design
- [ ] Apple design system consistent

## 🌐 Deployment Tests

### Test 10: Codespaces Functionality
- [ ] Codespace launches successfully
- [ ] Environment variables configured
- [ ] npm install completes
- [ ] npm run dev starts server
- [ ] Port forwarding works
- [ ] Public URL accessible

### Test 11: Production Build
- [ ] npm run build succeeds
- [ ] No TypeScript errors
- [ ] No runtime errors
- [ ] All pages render in production

### Test 12: Multi-device Testing
- [ ] Desktop browser (Chrome/Firefox/Safari)
- [ ] Mobile browser (iOS/Android)
- [ ] Tablet view
- [ ] Different screen sizes
- [ ] Touch interactions work

## 📊 Research Validation Tests

### Test 13: Complete Survey Flows
- [ ] Complete full survey as Order A participant
- [ ] Complete full survey as Order B participant  
- [ ] Verify data quality and completeness
- [ ] Check experimental balance
- [ ] Confirm counterbalancing works

### Test 14: Data Export & Analysis
- [ ] Export data to CSV
- [ ] Verify all experimental conditions represented
- [ ] Check data format for analysis software
- [ ] Confirm anonymization working

### Test 15: Participant Experience
- [ ] Survey instructions clear and complete
- [ ] Estimated time accurate (20-25 minutes)
- [ ] No technical barriers or confusion
- [ ] Professional appearance and function
- [ ] Smooth task transitions

## 🚨 Edge Case Tests

### Test 16: Error Handling
- [ ] Network interruption during survey
- [ ] Browser refresh mid-survey  
- [ ] Invalid input handling
- [ ] Database connection failures
- [ ] Graceful error messages

### Test 17: Load Testing
- [ ] Multiple simultaneous participants
- [ ] Concurrent database writes
- [ ] Google Sheets rate limiting
- [ ] Codespace performance under load

## ✅ Sign-off Checklist

- [ ] **Experimental Design**: ✅ Counterbalanced, randomized assignment working
- [ ] **Data Collection**: ✅ Database + Google Sheets integration successful  
- [ ] **User Experience**: ✅ Professional, accessible, mobile-friendly
- [ ] **Cloud Deployment**: ✅ Codespaces running reliably 24/7
- [ ] **Research Ready**: ✅ Participant URL ready for distribution

## 🎯 Final Validation

**Survey URL**: `https://[username]-urm-project-[id].github.dev`

**Expected Results**:
- Balanced experimental conditions (25% each of 4 combinations)
- Clean data export with experimental metadata  
- Professional participant experience
- Reliable cloud operation

**Ready for Research Participants**: ✅ / ❌

---

*Testing completed on: [DATE]*  
*Tested by: [RESEARCHER NAME]*  
*Survey version: Production v1.0*