import { useState, useEffect, useMemo, useCallback } from "react";

// ── Storage helpers ───────────────────────────────────────────────
const SK = "bb-v4";
const WK = "bb-wisdom";

const WISDOM_SEED = [[0,"🧠 行為心理","保持社交距離","心靈也要保持社交距離。看清楚誰是「有毒」的行為模式，微笑點頭，然後離遠一點。",""],[1,"🧠 行為心理","理解不代表認同","我能理解你為什麼這麼做（因為你的背景），但我不需要因此感到受傷。",""],[2,"🧠 行為心理","大腦的投影儀","他人對你的看法，通常反映的是他對自己的不滿。他是在罵鏡子裡的自己，你只是路過。",""],[3,"🧠 行為心理","評價是他的財產","他怎麼評價你，是存在他的腦子裡，不屬於你。你不需要為別人的財產負責。",""],[4,"🧠 行為心理","人類是習慣的奴隸","很多人行為討厭只是因為那是他幾十年的習慣。看透這一點，你會覺得他很可憐，而非可恨。",""],[5,"🧠 行為心理","你不是他的救火員","別人情緒失控是他自己的功課。你不必衝進火場幫他滅火，守好你自己的平靜。",""],[6,"🧠 行為心理","行為背後的恐懼","那些愛控制、愛炫耀的人，內心通常很恐懼。看穿了他們的脆弱，你就不會再生氣。",""],[7,"🧠 行為心理","壓力下的自動反應","有些人講話難聽，是因為他們大腦的「壓力模式」開啟了。那是故障，不是惡意。",""],[8,"🧠 行為心理","每個人都有濾鏡","每個人看世界都有偏見。他批評你，是在投射他的濾鏡，不是在描述真正的你。",""],[9,"🧠 行為心理","行為是天氣系統","他人的憤怒、自私或刻薄，是他們內在的天氣。你沒辦法叫天不下雨，只能學會自己撐傘。",""],[10,"🌿 活在當下","釋放對完美的執著","機器總有公差，生活總有意外。接受不完美，你才能專注於「現在能做什麼」。",""],[11,"🌿 活在當下","簡單的快樂最真","一碗熱湯、一個微笑、一段舒服的音樂。活在當下就是學會看見這些微小但真實的幸福。",""],[12,"🌿 活在當下","這秒過完就沒了","每一秒都是「限量版」。既然這麼珍貴，為什麼要拿這一秒去後悔上一秒的事？",""],[13,"🌿 活在當下","情緒只是過路客","情緒就像路邊經過的車，讓它開過去就好。你站在路邊看著，不必跳到車輪底下被它輾過。",""],[14,"🌿 活在當下","現在就是最好的時機","沒什麼「以後再說」。想跟家人吃飯、想休息、想看書，現在就去做，這才叫活著。",""],[15,"🌿 活在當下","五感全開法","看看顏色、聽聽聲音、聞聞氣味。把注意力拉回感官，負面思考的迴路就會暫時斷電。",""],[16,"🌿 活在當下","別預支明天的煩惱","明天的雨明天再撐傘。現在天是晴的，你就該享受陽光，別浪費時間看氣象預報。",""],[17,"🌿 活在當下","呼吸是定位器","覺得心亂時，摸摸肚子感覺呼吸。這是在告訴大腦：「我現在在這裡，我是安全的。」",""],[18,"🌿 活在當下","一次只處理一件事","大腦就像單核心處理器，一次跑太多程式會當機。專注當下這件事，效率最高，煩惱最少。",""],[19,"🌿 活在當下","手上的咖啡最香","喝咖啡時就聞它的香氣。別在喝咖啡時想明天的會議，否則咖啡就白喝了。",""],[20,"🚨 心靈急救箱","百年後的清零效應","99%的人在三代之後，時間會徹底抹去存在的痕跡。既然一切稍縱即逝，我們就沒時間去爭吵、傷心。我們只有時間去愛、去享受「眼前景、碗中餐、身邊人」。","⭐⭐⭐"],[21,"🧭 人生意義","接受自己的有限","我們不必拯救世界，只要照顧好自己的心，對得起家人，這輩子的任務就算圓滿達成了。",""],[22,"🧭 人生意義","體驗比擁有重要","房子、車子是硬體，感受和體悟是軟體。硬體會舊，軟體會隨時間不斷升級，這才是真正的財產。",""],[23,"🧭 人生意義","幫助他人的回饋","扶別人一把時，你自己也會站得更穩。意義往往產生於你對這個世界的微小貢獻裡。",""],[24,"🧭 人生意義","對未來的回報","現在學的每一行代碼、讀的每一段話，都是在給未來的自己送禮物。這就是學習的意義。",""],[25,"🧭 人生意義","意義不在終點","就像跑馬拉松，重點是呼吸和心跳的過程。如果只為了那個終點，那拿個獎牌就結束了，太可惜了。",""],[26,"🧭 人生意義","平凡中的不平凡","每天把該做的事做好，這就是一種偉大。穩定、持續的產出，本身就是對生命最大的尊重。",""],[27,"🚨 急救箱","你是觀察者，不是情緒本身","練習說：「我感覺到憤怒」，而不是「我很憤怒」。拉開一個身位的距離，你就有了觀察與阻斷負面迴路的空間。",""],[28,"🔋 動力源","活在當下的「微觀幸福」","幸福不是等退休或中獎。幸福是下午的一杯黑咖啡、一段好聽的音樂、或是完成一串 Python 代碼。累積這些，大腦就會重塑。",""],[29,"🚨 急救箱","拒絕活在別人的期待裡","你不是為了滿足別人的期望而來到這個世界。別人對你的失望，是他的期待管理出問題，不是你的錯。",""],[30,"🔋 動力源","把「我不行」改成「我還沒學會」","換個詞，大腦的反應就完全不同。「我不行」是判死刑，「我還沒學會」是給大腦下達學習指令。",""],[31,"🚨 急救箱","當下的呼吸是唯一出口","焦慮就像溺水。專注於每一次的吸氣與吐氣，就是把頭浮出水面。只要這一秒還在呼吸，你就是安全的。",""],[32,"🔋 動力源","小事成就的複利","每天完成一件小事（例如洗好碗、跑完步）。大腦會因為這些微小的「完成感」產生獎勵機制，負面迴路就會慢慢被成就感蓋過去。",""],[33,"🚨 急救箱","別為想像的劇本付費","大腦最愛演「未來慘況」的恐怖片。在事情還沒發生前，別拿你的平靜去付那些不存在的票價。",""],[34,"🔋 動力源","你是畫家，不是畫布","生命本身是一張白紙。別人的看法只是噴濺上來的墨水，你才是拿筆的人。你今天畫了什麼，遠比白紙上有什麼墨水重要。",""],[35,"🚨 急救箱","大腦的「負面廣播」","負面情緒就像是沒關掉的廣播電台，一直在播舊聞。發現它在播時，大聲對心裡說「停！換台」。把注意力拉回當下。",""],[36,"🧭 導航儀","自信不是不會輸","真正的自信不是「我一定會成功」，而是「就算失敗了，我也能承受，且知道該怎麼處理」。自信是從一次次的「修復過程」中長出來的肌肉。",""],[37,"🔋 動力源","自卑是想進步的訊號","覺得自己不如人，是大腦在提醒你「我想變得更好」。自卑不是缺點，是前進的燃料。重點不是消除它，而是帶著這份動力去學你想學的東西。",""],[38,"🚨 急救箱","他在打他的仗，你路過而已","當有人對你無禮，通常是他內心正處於焦慮或受挫的「戰區」。他是對現實投降，不是對你進攻。離火場遠一點，別進去幫他添柴火。",""],[39,"🧭 導航儀","他人行為是自然現象","別人的壞脾氣或偏見，就像突然下雨或颳風。那是他的「天氣系統」在運作，不是針對你。你沒辦法控制，只要不讓別人的天氣淋濕自己的心。",""],[40,"🧭 導航儀","心靈的減法","清理腦袋就像整理倉庫。把那些「過去的後悔」和「未來的擔憂」丟掉，空間大了，好運才進得來。",""],[41,"🔋 動力源","此地、此刻、此人","最重要的時間就是「現在」，最重要的人就是「眼前這一個」。別分心去管那些不在現場的人事物。",""],[42,"🚨 急救箱","草莓的滋味","就算天快塌了，路邊的草莓如果很甜，你就該大口咬下去。不讓未來的危險奪走現在的甜美，這才是硬漢的智慧。",""],[43,"🧭 導航儀","身在桃源處","覺得憂慮是在想過去，覺得焦慮是在想未來。如果你覺得平靜，代表你正待在「現在」這個地方。",""],[44,"🚨 急救箱","別為想像受苦","我們擔心的事，90% 根本不會發生。別為還沒寄來的帳單付利息，那叫浪費生命。","⭐⭐⭐"],[45,"🚨 急救箱","唯一的真實時刻","過去是張作廢的支票，未來是張還沒兌現的匯票。只有「現在」是口袋裡的現金，別拿現金去換那兩張紙。",""],[46,"🧭 導航儀","生命是一場演奏","聽音樂不是為了聽完最後一個音符，跳舞也不是為了跳到終點。人生是來「玩」的，不是來「趕進度」的。",""],[47,"🚨 急救箱","洗碗時就只是洗碗","做這件事時別想著下一件事。如果洗碗時在想喝茶，你既沒洗好碗，也沒喝到茶。專心在手上的水溫，這就是活著。",""],[48,"🔋 動力源","相信自己「能做到」","相信自己「行」，你就真的行。這種自信不是催眠，而是給大腦下達正確的指令，讓身體自動跟上。",""],[49,"🔋 動力源","進入心流狀態","找件有難度但你喜歡的事去做，做到忘記時間、忘記煩惱。這種「忘我」的時刻，是大腦最有效的維修保養。","⭐"],[50,"🧭 導航儀","習得性樂觀","倒楣的事發生，別說「我就是命苦」，要說「這只是暫時的意外」。樂觀是一種可以練出來的「肌肉」，多練幾次，負面迴路就斷了。",""],[51,"🚨 急救箱","無條件的自我接納","奇怪的是，當你承認自己「現在就是這副德性」時，改變反而開始了。你不需要變優秀才值得被愛，現在的你就已經夠好了。",""],[52,"🔋 動力源","自卑是向上的動力","覺得自己不如人，其實是老天給你的「加速器」。自卑不是病，它是想讓你變強的火藥。重點不是你從哪來，而是你打算往哪去。",""],[53,"🧭 導航儀","接納內心的陰影","別想把自己變完美。每個人都有陰暗面，那不叫缺點，那是你的一部分。學會跟討厭的自己「共存」，你才不會活得那麼累。",""],[54,"⚙️ 產線管理","守好自己的能量場","爛下屬會吸乾你的能量。別讓他在你腦子裡「免費住宿」。下班門一關，這些怠慢的人就不存在於你的世界。",""],[55,"⚙️ 產線管理","觀察他的「行為曲線」","把每個人當作一個研究對象。他今天又開始躲工作了，這就是他的模式。像觀察動物一樣觀察他，你就會覺得很有趣，而不是很生氣。",""],[56,"⚙️ 產線管理","情緒隔離牆","當下屬出錯時，專注於「怎麼修好」，而不是「他為什麼這麼笨」。「為什麼」會引發憤怒，「怎麼做」會帶來行動。阻斷負面迴路的關鍵就是換個問法。",""],[57,"⚙️ 產線管理","降低期待，減少傷害","你不能要求每個人都像你一樣專業。有些人上班只是為了那口飯，對這種人，只要他「及格」就好。把心力留給真正值得你教的人。",""],[58,"⚙️ 產線管理","別在豬圈裡跟豬打架","下屬表現差、態度爛，那是他的層次。如果你為了他的怠慢而暴跳如雷，你的水平就降到跟他一樣了。用制度規範他，不要用情緒教育他。",""],[59,"🚨 壓力緩衝","預演最壞的情況","如果他真的不滿意，最壞會怎樣？想通了，恐懼就消失了。大腦的負面迴路最怕「看透」。一旦你看透結果，壓力就成了空氣。",""],[60,"🚨 壓力緩衝","評價不等於產值","主管的一句差評不代表你的價值。那只是他在當下那個心情、那個角度的看法。你的價值是由你解決的問題數量決定的，不是由他的嘴巴決定的。",""],[61,"🚨 壓力緩衝","你不是他的救火員","主管自己沒規劃好導致的緊急，是他的失職。你可以幫忙解決問題，但不必陪著他心跳加速。保持你的節奏，火才不會燒到你心裡。",""],[62,"🚨 壓力緩衝","情緒與指令的分離","主管講話難聽是他的「外殼」，交辦的任務才是「核心」。把包裹在任務外的垃圾話直接丟掉，只取出裡面的工作清單。垃圾話是他的素質，把事做好是你的專業。",""],[63,"🚨 壓力緩衝","主管也是受壓體","主管對你施壓，通常是因為他上面也有火在燒。他不是在針對你，他只是在「轉嫁焦慮」。你只要處理「事情」，不必承接他的「焦慮」。",""],[64,"🚀 增加自信","每天練習「說一段話」","就像練 Python，表達也需要肌肉記憶。對著鏡子或家人說說今天的體悟。每天三分鐘，大腦的小路就會越走越寬。",""],[65,"🚀 增加自信","練習「慢」的優雅","講慢一點，每一句話之間都留個小空白。慢速能給大腦充足的時間找詞，也能讓對方覺得你很穩重。",""],[66,"🚨 急救箱","承認「我卡住了」","如果真的接不下去，直接笑著說：「等一下，我腦袋突然卡帶了。」這種坦誠會拉近距離，消除敵意。承認脆弱的人，反而最有自信。",""],[67,"🔋 動力源","肯定自己的每一次表達","講完一段話，不管順不順，心裡都對自己說：「這段表達完成了，不錯。」累積這些小的正向標記，大腦才會愛上表達。",""],[68,"🚨 急救箱","停頓不是尷尬，是威嚴","說不出話時，就乾脆停下來深呼吸。沉默不是斷電，是在儲存能量。對方會以為你在思考重要決策，這比支支吾吾更有力量。",""],[69,"💎 去除自卑","自卑是幻覺","很多時候，你擔心的缺點，別的人根本沒注意到。別把自己放在顯微鏡下嚇自己。",""],[70,"💎 去除自卑","你是自己的好朋友","試著像對待好朋友那樣對待自己。你會罵朋友「沒用」嗎？如果不，也請別對自己說。",""],[71,"💎 去除自卑","過去不等於現在","小時候被否定的經驗，就像舊款手機的系統。你現在已經升級了，別再跑舊軟體。",""],[72,"💎 去除自卑","你是原廠正貨","即使你有瑕疵，你也是世界上唯一的版本。瑕疵也是你獨一無二的標記。",""],[73,"💎 去除自卑","自卑是動力源","覺得自己不夠好，代表你大腦想讓你更進步。把這份能量用來學東西，而不是用來罵自己。",""],[74,"💎 自信心重建","對比的陷阱","跟 20 歲比體力、跟天才比智商，那是自找麻煩。跟昨天的自己比，只要今天比昨天清醒一點點，你就是贏家。",""],[75,"💎 自信心重建","失敗只是「數據收集」","做錯決定不代表你沒價值。那只是這條路行不通，你收集到了一個數據。真正的挫折是從此不敢走，而不是走錯一步。",""],[76,"💎 自信心重建","心情不等於事實","「我覺得我沒價值」只是一個化學訊號，不是客觀事實。就像機台報警可能是感應器壞了，不是機器真的壞了。別相信當下的負面情緒。",""],[77,"🧭 導航儀","比較是幸福的盜賊","你原本有一碗好喝的湯，看見別人的肉比較多，你的湯瞬間就變苦了。這不是湯變了，是你的「心念」下毒了。趕快把毒倒掉，回頭喝你的湯。",""],[78,"🔋 動力源","享受「微小的領先」","今天的血糖比昨天穩、今天的英文多記了一個單字。跟自己的「昨天」比，這種小贏的快感才是重塑大腦的真藥。",""],[79,"🚨 急救箱","你看的是他的「精華剪輯」","你拿自己辛苦的「幕後花絮」，去比別人包裝過的「正式演出」，這對自己太不公平。別人的風光背後也有爛帳，只是他沒讓你看到而已。",""],[80,"🧭 導航儀","不同規格，無法對比","就像拿「堆高機」去跟「跑車」比速度，這本身就是邏輯錯誤。每個人的人生規格、起點、零件都不同，比較出的結果完全沒有參考價值。","⭐⭐"],[81,"🚨 急救箱","放下「贏」的包袱","贏了別人又怎樣？明天還會有更強的人出現。「想贏」的心會讓你變得緊繃，只有「想通」的心才能讓你自由。",""],[82,"🧭 人生意義","你是家庭的「壓艙石」","你的存在讓身邊的人感到安穩，這種「情感價值」是任何績效指標都量不出來的。",""],[83,"🚀 增加自信","小贏也是贏","今天修好一個 Bug、看完一篇錦囊、寫好一行 Python。記錄這些微小的勝利，讓大腦的獎勵機制重新運作。自信是從小地方長出來的。",""],[84,"🚀 增加自信","準備是自信的基石","就像工廠的 SOP，準備得越足，心就越定。實力才是對抗焦慮的最強武器。",""],[85,"🚀 增加自信","接受失敗的韌性","自信不是「我不會錯」，而是「錯了我也能修好」。這種修復能力才是真自信。",""],[86,"🚀 增加自信","身體引導大腦","挺起胸膛，深呼吸。姿勢變了，體內的化學反應也會跟著變，自信會跟著來。",""],[87,"🚨 心靈急救箱","翻篇的能力：活在當下","如果你抑鬱，說明活在過去；如果你焦慮，說明活在未來；如果你平靜，說明活在當下。遇爛人及時止損，遇爛事及時抽身。人一定要有「翻篇」的能力。","⭐⭐⭐"],[88,"🚨 心靈急救箱","快樂秘密：無所謂","除了生病，你感受到的痛苦都是情緒帶來的，而非真實存在。保持快樂的秘密就是「無所謂」：愛誰誰、沒必要、不至於。","⭐⭐⭐"],[89,"🚨 心靈急救箱","公司「沒你也行」是福氣","地球少了誰都轉，公司沒了你也照樣運作。承認這一點，是要把你從「救世主」的幻覺中解放出來。公司是別人的，命是自己的。","⭐⭐⭐"],[90,"🚨 心靈急救箱","下班即「下崗」","脫下工服那一刻，工廠的人就與你無關了。不要用公司的問題來懲罰當下的自己。現在的你，只負責「呼吸」和「休息」。","⭐⭐⭐"],[91,"🚨 心靈急救箱","沒那麼重要，才最舒服","「沒人看你」其實是這世界上最自由的事。既然沒幾個人真的在乎你，你又何必在乎那些帶不走的煩惱？放下「被需要」的執念。","⭐⭐⭐"],[92,"🌱 人生視角","人生是曠野，而非軌道","人生不是一條既定的「單向鐵軌」。真相是人生是一片充滿無限可能的「曠野」。只要當下的你是享受的，這段歷程就有意義。",""],[93,"🧭 人生意義","來日方長 vs 世事無常","昨天離世的人，或許還在規劃今天。那些以為的「來日方長」，轉眼就成了「世事無常」。別總是在「等以後」，此時此刻的平安與體驗，就是活著唯一的意義。","⭐⭐⭐"],[94,"🕯️ 意義治療","在苦難中尋找意義","維克多·弗蘭克：人可以被剝奪一切，除了最後一項自由——在任何處境中選擇自己的態度。生命不問你有什麼意義，而是問你如何回應它。",""],[95,"🏛️ 斯多葛學派","別為想像受苦","塞內卡：我們在想像中受的苦，遠比在現實中多。當下的痛苦通常是有限的，但對未來的擔憂卻是無限的。回到現在，痛苦就會減半。","⭐⭐⭐"],[96,"🍃 道家思想","身在桃源處","老子：如果你憂鬱，你活在過去；如果你焦慮，你活在未來；如果你平和，你才活在當下。當下的呼吸，就是通往自由的出口。",""],[97,"🧘 禪宗智慧","洗碗時就只是洗碗","一行禪師：洗碗時如果想著等一下的茶，你就不在洗碗，也不在當下。生命是由無數個「當下」組成的，若不學會洗碗，你一輩子都喝不到那杯茶。","⭐"],[98,"🧠 精神分析","冰山下的潛意識","佛洛伊德：人的意識只是冰山一角，90% 的行為受潛意識驅動。了解自己的「不可理喻」，是與自己和解的第一步。",""],[99,"❤️ 人本主義","無條件的自我接納","卡爾·羅傑斯：奇怪的悖論是，當我接納自己本來的樣子時，我才開始改變。你不需要變得「更好」才值得被愛。",""],[100,"🚀 個體心理學","自卑是向上的動力","阿爾弗雷德·阿德勒：自卑並不可怕，它是人類追求卓越的原始動力。我們不是被過去決定，而是由我們賦予過去的「意義」決定。",""],
[101,"🚨 急救箱","停頓不是尷尬，是威嚴","說不出話時，就乾脆停下來深呼吸。沉默不是斷電，是在儲存能量。 對方會以為你在思考重要決策，這比支支吾吾更有力量。",""],
[102,"💪 認知心理","社會學習與自我效能","阿爾伯特·班杜拉：相信自己「能做到」的力量，遠比能力本身重要。自我的信念，是決定行動成敗的隱形推手。",""],
[103,"🚨 急救箱","你是來體驗，不是來參賽","就像去旅遊，你會跟隔壁團的比誰的拍照姿勢美嗎？人生這場旅遊，你只負責帶回屬於你的照片和回憶。 別管隔壁團在幹嘛。",""],
[104,"🧭 導航儀","理解行為的本質","有些人愛炫耀、愛競爭，是因為他內心極度自卑。看穿了他是在「求關注」，你對他只會感到同情，而不會感到威脅。",""],
[105,"🔋 動力源","享受「微小的領先」","今天的血糖比昨天穩、今天的英文多記了一個單字。跟自己的「昨天」比，這種小贏的快感才是重塑大腦的真藥。",""],
[106,"🚨 急救箱","拒絕被標籤綁架","別人用「薪水」、「職位」來標籤你，那是他的淺薄。如果你也拿這些去跟人比，你就是把自己也標籤化了。 揭掉標籤，你就是自由的生命。",""],
[107,"🧭 導航儀","世界很大，容得下所有人","曠野不是獨木橋。別人發光，不會讓你變暗；別人跑得快，不會讓你停下來。 宇宙的資源（幸福感）是無限的。",""],
[108,"🔋 動力源","你的價值是「不可替代性」","競爭是為了取代別人，但你是唯一的。你的經歷、你的感悟、你的 55 年人生，是任何人都競爭不走的「專利財產」。",""],
[109,"🚨 急救箱","停下「虛擬競賽」","腦子裡老是在演「我要比他強」的戲，這會消耗大量的心靈電力。直接按「強制結束工作」，把電力省下來感受當下的咖啡。",""],
[110,"🧭 導航儀","比較是幸福的盜賊","你原本有一碗好喝的湯，看見別人的肉比較多，你的湯瞬間就變苦了。這不是湯變了，是你的「心念」下毒了。 趕快把毒倒掉，回頭喝你的湯。",""],
[111,"🔋 動力源","欣賞不代表威脅","看到美好的事物（別人的成就），試著像欣賞風景一樣點點頭。風景是美的，我也是美的，兩者可以同時存在。",""],
[112,"🚨 急救箱","放下「贏」的包袱","贏了別人又怎樣？明天還會有更強的人出現。「想贏」的心會讓你變得緊繃，只有「想通」的心才能讓你自由。",""],
[113,"🌊 積極心理學","進入心流狀態","米哈里·奇克森特米海伊：當你全身心投入一件具挑戰性的事，時間會消失。幸福不是結果，而是你在「心流」中感受到的掌控感。","⭐"],
[114,"🧭 導航儀","成功沒有標準模板","55 歲當副理很成功，55 歲學會攝影、學會 Python 也很成功。曠野上沒有領獎台，只要你覺得活得「夠味」，那就是頂級的成功。",""],
[115,"🔋 動力源","專注於「我的產出」","產線上的良率是你管的，你自己的心情良率也該由你管。管好自己的良率，比看隔壁廠房的報表更有意義。",""],
[116,"🚨 急救箱","大腦的「嫉妒報警」","當你心裡酸酸的時候，那是大腦在報警說：「我也想要那個。」把「酸味」轉化為「動力」。 既然想要，就去思考怎麼幫自己創造，而不是怪別人。",""],
[117,"🧭 導航儀","平行時空的幻覺","羨慕別人時，問問自己：「我願意連他的痛苦和責任也一起接收嗎？」如果只想拿好處，不想扛代價，那種比較就是不切實際的幻想。",""],
[118,"🔋 動力源","你是這場賽事的唯一選手","這是一場只有你一個人的馬拉松。沒有對手，就沒有所謂的「落後」。 只要你還在呼吸、還在感受，你就是這場比賽的冠軍。",""],
[119,"🚨 急救箱","競爭是大腦的「存糧焦慮」","遠古時代資源少，不搶會餓死。但現在不是原始森林，別人的收穫不會讓你少一口飯。 這種焦慮是過時的本能，手動關掉它。",""],
[120,"🧭 導航儀","他人是參照物，不是障礙物","看見別人成功，把它當作一個「原來路可以這樣走」的數據就好。他走他的，你走你的，這兩條路在廣闊的曠野上完全不重疊。",""],
[121,"🔋 動力源","內在記分卡","真正優秀的人，心裡有一張自己的「記分卡」。今天有沒有比昨天更清醒？這行 Python 寫得有沒有比昨天順？ 只要對自己負責，別人的分數就是廢紙。",""],
[122,"🚨 急救箱","你看的是他的「精華剪輯」","你拿自己辛苦的「幕後花絮」，去比別人包裝過的「正式演出」，這對自己太不公平。別人的風光背後也有爛帳，只是他沒讓你看到而已。",""],
[123,"🧭 導航儀","不同規格，無法對比","就像拿「堆高機」去跟「跑車」比速度，這本身就是邏輯錯誤。每個人的人生規格、起點、零件都不同，比較出的結果完全沒有參考價值。","⭐⭐"],
[124,"🧭 曠野導航儀","習得性樂觀","馬丁·塞利格曼：樂觀不是天賦，而是一種可以習得的技術。改變你對挫折的「解釋風格」，就能從無助感中解脫。",""],
[125,"🚨 心靈急救箱","這一切都會過去","信心危機就像一場霧，霧氣再大，路還是在那裡。等這場情緒的霧散了，你會發現你累積的一切從未離開。 撐住，當下就是力量。",""],
[126,"🧭 人生意義","不被定義的自由","你是鄧仁凱，不是「鄧副理」。工作只是你生命的一小部分，別讓職稱的高低決定你靈魂的重量。 你有隨時重新定義自己的自由。",""],
[127,"🚀 增加自信","你的「存在」本身就是意義","就像曠野裡的一棵老樹，不必開花，光是它站在那裡擋風遮雨，就是功德。鄧副理，你站在這裡，就是這座工廠的穩定器。",""],
[128,"🧠 行為心理","行為塑造心情","覺得沒信心時，更要穿得整齊、坐得挺拔。生理訊號會反過來重塑大腦迴路。 裝久了，大腦就會以為你真的很有把握。",""],
[129,"💎 自信心重建","對比的陷阱","跟 20 歲比體力、跟天才比智商，那是自找麻煩。跟昨天的自己比，只要今天比昨天清醒一點點，你就是贏家。",""],
[130,"🚨 急救箱","放下「應該」的枷鎖","我「應該」更強、我「應該」什麼都懂。這些「應該」是負面迴路的養分。把「應該」改成「如果能...更好」，放過自己，信心就會回來。",""],
[131,"🧭 人生意義","傳承的意義","你教過的一個念頭、指點過的一個新人，這都是你生命的延續。你的價值活在那些受過你影響的人身上。 這種影響力會持續很久。",""],
[132,"🚀 增加自信","小贏也是贏","今天修好一個 Bug、看完一篇錦囊、寫好一行 Python。記錄這些微小的勝利，讓大腦的獎勵機制重新運作。 自信是從小地方長出來的。",""],
[133,"🧠 行為心理","透明度錯覺","你以為別人都看得出你的心虛？其實大家都忙著管自己的焦慮。只要你表現得淡定，你就是大家眼中的定海神針。 信心是可以「演」出來的。",""],
[134,"💎 自信心重建","失敗只是「數據收集」","做錯決定不代表你沒價值。那只是這條路行不通，你收集到了一個數據。 真正的挫折是從此不敢走，而不是走錯一步。",""],
[135,"❤️ 人本主義","無條件的自我接納","卡爾·羅傑斯：奇怪的悖論是，當我接納自己本來的樣子時，我才開始改變。你不需要變得「更好」才值得被愛。",""],
[136,"🚨 急救箱","拒絕「有用論」的綁架","社會教我們要成功、要有用。但生命美學告訴我們：活得自在、活得像自己，就是最大的成功。 你的價值由你定義，不是由績效表定義。",""],
[137,"🧭 人生意義","你是家庭的「壓艙石」","在公司你可能是副理，在家裡你是天。你的存在讓身邊的人感到安穩，這種「情感價值」是任何績效指標都量不出來的。",""],
[138,"🚀 增加自信","55 歲的「降維打擊」","很多事你現在覺得簡單，是因為你變強了，不是事變容易了。別把自己的專業當作「沒什麼」，那對別人來說可能是天大的難關。",""],
[139,"🧠 行為心理","大腦的「負向偏誤」","人類大腦為了生存，天生會放大「我做錯什麼」，縮小「我做對什麼」。這是一種生存本能，不是你的真相。 你得刻意去數自己的功勞。",""],
[140,"💎 自信心重建","別拿別人的「剪輯版」比","你拿自己辛苦的「幕後花絮」去比別人光鮮亮麗的「正片」，當然會自卑。每個人都有漏洞，只是你沒看到對方的狼狽而已。",""],
[141,"🚨 急救箱","心情不等於事實","「我覺得我沒價值」只是一個化學訊號，不是客觀事實。就像機台報警可能是感應器壞了，不是機器真的壞了。 別相信當下的負面情緒。",""],
[142,"🚀 增加自信","累積的「複利」不會消失","你這 30 年的工廠經驗已經刻進骨子裡了。遇到危機時你的「直覺」，是年輕人學不來的「心智資產」。 這就是你無可取代的價值。",""],
[143,"🧭 人生意義","** invisible 價值的力量**","你在產線上穩定軍心、在主管與下屬間做緩衝，這些看不見的「潤滑」也是價值。就像空氣，平時感覺不到，但沒了它系統就會燒毀。",""],
[144,"🧠 行為心理","冒名頂替者症候群","即使當到副理，內心也會怕別人發現「其實我沒那麼厲害」。事實上，全世界優秀的人都有這種恐懼。 這代表你對專業有敬畏心，不是你真的差。",""],
[145,"💎 自信心重建","價值不是「功能性」","很多人覺得「我沒用了」是因為把自己當成零件。零件沒功能就報廢，但人是生命，生命的存在本身就是價值。 你不需要「有用」才值得活著。",""],
[146,"🏔️ 人本主義","自我實現的頂峰","亞伯拉罕·馬斯洛：人不僅是為了生存，更是為了實現潛能。當你不再為生存焦慮，你的靈魂就會渴望創造與巔峰體驗。",""],
[147,"⚙️ 產線管理","守好自己的能量場","爛下屬會吸乾你的能量。別讓他在你腦子裡「免費住宿」。 下班門一關，這些怠慢的人就不存在於你的世界。",""],
[148,"⚙️ 產線管理","觀察他的「行為曲線」","把每個人當作一個研究對象。喔，他今天又開始躲工作了，這就是他的模式。 像觀察動物一樣觀察他，你就會覺得很有趣，而不是很生氣。",""],
[149,"⚙️ 產線管理","保持適度的冷漠","太在乎下屬的看法，你就會被他牽著走。專業的冷漠是最好的防護罩。 我發薪水給你，你提供勞動力，這就是最清爽的契約關係。",""],
[150,"⚙️ 產線管理","你是教練，不是家長","教練只看場上的表現。他私下愛怎麼怠慢是他的命運，你只要確保他在場上符合規範。 不要試圖改變一個人的本性，那太累了。",""],
[151,"⚙️ 產線管理","看穿他的防衛機制","下屬找藉口，是因為他害怕承擔。那種卑微的防衛行為，反映出他內心的弱小。 看到他的弱小，你對他的行為就會多一份同情，少一份火氣。",""],
[152,"⚙️ 產線管理","情緒隔離牆","當下屬出錯時，專注於「怎麼修好」，而不是「他為什麼這麼笨」。「為什麼」會引發憤怒，「怎麼做」會帶來行動。 阻斷負面迴路的關鍵就是換個問法。",""],
[153,"⚙️ 產線管理","降低期待，減少傷害","你不能要求每個人都像你一樣專業。有些人上班只是為了那口飯，對這種人，只要他「及格」就好。 把心力留給真正值得你教的人。",""],
[154,"⚙️ 產線管理","管理是修路，不是拉車","下屬推不動，可能是路（系統）不好走。與其氣他偷懶，不如檢查流程哪裡卡住。 把他看作是一個「變數」，而不是一個「對手」。",""],
[155,"⚙️ 產線管理","別在豬圈裡跟豬打架","下屬表現差、態度爛，那是他的層次。如果你為了他的怠慢而暴跳如雷，你的水平就降到跟他一樣了。 用制度規範他，不要用情緒教育他。",""],
[156,"⚙️ 產線管理","怠慢是人的低耗能模式","下屬想偷懶、想省力，是生物尋求「最低耗能」的自然本能。這不是對你不尊重，這只是「生物慣性」。 只要 SOP 沒斷，就當作是自然現象。",""],
[157,"🕯️ 意義治療","在苦難中尋找意義","維克多·弗蘭克：人可以被剝奪一切，除了最後一項自由——在任何處境中選擇自己的態度。生命不問你有什麼意義，而是問你如何回應它。",""],
[158,"🚨 壓力緩衝","預演最壞的情況","如果他真的不滿意，最壞會怎樣？想通了，恐懼就消失了。大腦的負面迴路最怕「看透」。 一旦你看透結果，壓力就成了空氣。",""],
[159,"🚨 壓力緩衝","拒絕「過度負責」","盡力做到 SOP 的要求，剩下的意外是機率問題。別拿公司的公事來懲罰自己的私心。 責任要扛，但情緒要放。",""],
[160,"🚨 壓力緩衝","職場是場角色扮演","在工廠裡他是主管、你是副理。脫下制服，大家都是平等的生命。 別把職位上的上下關係，帶進你靈魂的深處。",""],
[161,"🚨 壓力緩衝","評價不等於產值","主管的一句差評不代表你的價值。那只是他在當下那個心情、那個角度的看法。 你的價值是由你解決的問題數量決定的，不是由他的嘴巴決定的。",""],
[162,"🚨 壓力緩衝","你不是他的救火員","主管自己沒規劃好導致的緊急，是他的失職。你可以幫忙解決問題，但不必陪著他心跳加速。 保持你的節奏，火才不會燒到你心裡。",""],
[163,"🚨 壓力緩衝","設立心理公差","就像機台容許誤差，你也該容許主管有「發神經」的公差。只要不影響產線運作，他吼兩句就當作是機台老舊的噪音。 噪音不需要解釋，聽過就算。",""],
[164,"🚨 壓力緩衝","不做「情緒海綿」","辦公室的低氣壓是「環境因素」。你可以觀察到這股氣壓，但你不必把它吸進肺裡。 提醒自己：我現在在工廠，這只是場暫時的雷陣雨。",""],
[165,"🚨 壓力緩衝","他沒你想的那麼強大","很多主管表現得強勢，其實是為了掩飾內心的心虛。強勢是他的武裝，看穿他的不安，你就不會覺得他在高處。 大家都只是在曠野中找路的人。",""],
[166,"🚨 壓力緩衝","情緒與指令的分離","主管講話難聽是他的「外殼」，交辦的任務才是「核心」。把包裹在任務外的垃圾話直接丟掉，只取出裡面的工作清單。 垃圾話是他的素質，把事做好是你的專業。",""],
[167,"🚨 壓力緩衝","主管也是受壓體","主管對你施壓，通常是因為他上面也有火在燒。他不是在針對你，他只是在「轉嫁焦慮」。 把他的情緒看成是傳動帶上的動能，你只要處理「事情」，不必承接他的「焦慮」。",""],
[168,"🚀 個體心理學","自卑是向上的動力","阿爾弗雷德·阿德勒：自卑並不可怕，它是人類追求卓越的原始動力。我們不是被過去決定，而是由我們賦予過去的「意義」決定。",""],
[169,"🚀 增加自信","相信時間的力量","就像複利一樣，每天進步 1%，一年後你會強大到連自己都認不出來。",""],
[170,"🚀 增加自信","你是解決問題的人","把「為什麼是我遇到這事」改成「我現在能怎麼解決」。切換思維，自信就回來了。",""],
[171,"🚀 增加自信","練習拒絕","學會拒絕不合理的要求。當你開始守護自己的邊界，你的自我價值感就會提升。",""],
[172,"🚀 增加自信","與強者同行","跟有正能量、肯學習的人在一起。自信和積極是會傳染的，就像產線上的自動同步。",""],
[173,"🚀 增加自信","獎勵自己的努力","不管結果如何，只要你努力過了，就給自己一點獎勵。這是在強化大腦的正面行為。",""],
[174,"🚀 增加自信","敢於說「我不懂」","真正自信的人不怕承認無知。這代表你有足夠的底氣去學習，而不是打腫臉充胖子。",""],
[175,"🚀 增加自信","準備是自信的基石","就像工廠的 SOP，準備得越足，心就越定。實力才是對抗焦慮的最強武器。",""],
[176,"🚀 增加自信","接受失敗的韌性","自信不是「我不會錯」，而是「錯了我也能修好」。這種修復能力才是真自信。",""],
[177,"🚀 增加自信","身體引導大腦","挺起胸膛，深呼吸。姿勢變了，體內的化學反應也會跟著變，自信會跟著來。",""],
[178,"🚀 增加自信","從小勝到大勝","每天完成三件微小的事（例如準時起床、喝水）。大腦會累積「我做得到」的紀錄。",""],
[179,"☯️ 分析心理學","接納內心的陰影","卡爾·榮格：每個人都有「陰影」，它是你拒絕承認的自己。與其追求完美，不如追求「完整」；接納陰影，生命才會有光。",""],
[180,"💎 去除自卑","自卑是幻覺","很多時候，你擔心的缺點，別的人根本沒注意到。別把自己放在顯微鏡下嚇自己。",""],
[181,"💎 去除自卑","你是自己的好朋友","試著像對待好朋友那樣對待自己。你會罵朋友「沒用」嗎？如果不，也請別對自己說。",""],
[182,"💎 去除自卑","專注於「能改進的」","身高改不了，但知識和技能可以。把心力放在能優化的地方，成就感會蓋過自卑。",""],
[183,"💎 去除自卑","每個人都在裝忙","你以為別人都很自信？其實大家內心都在打鼓。你並不孤單，大家都在學著變強。",""],
[184,"💎 去除自卑","過去不等於現在","小時候被否定的經驗，就像舊款手機的系統。你現在已經升級了，別再跑舊軟體。",""],
[185,"💎 去除自卑","別人的讚美也是真話","當別人誇你時，別急著否認。練習說聲「謝謝」，大腦會慢慢相信你真的不錯。",""],
[186,"💎 去除自卑","練習「關掉聲音」","腦子裡那個說你「不行」的聲音，只是個舊程式。發現它在跑時，手動按一下「結束工作」。",""],
[187,"💎 去除自卑","你是原廠正貨","即使你有瑕疵，你也是世界上唯一的版本。瑕疵也是你獨一無二的標記。",""],
[188,"💎 去除自卑","自卑是動力源","覺得自己不夠好，代表你大腦想讓你更進步。把這份能量用來學東西，而不是用來罵自己。",""],
[189,"💎 去除自卑","停止與影子比賽","拿自己的缺點去比別人的優點，就像拿螺絲起子去比電鑽。每個人規格不同，沒什麼好比的。",""],
[190,"🧠 精神分析","冰山下的潛意識","西格蒙德·佛洛伊德：人的意識只是冰山一角，90% 的行為受潛意識驅動。了解自己的「不可理喻」，是與自己和解的第一步。",""],
[191,"🌱 人生視角","人生是曠野，而非軌道","人生不是一條既定的「單向鐵 軌」,而出軌就是失敗。真相是人生是一片充 滿無限可能的「曠野」。只要當下的您是享受 的,這段歷程就有意義。",""],
[192,"🚨 心靈急救箱","翻篇的能力:活在當下","如果你抑鬱,說明活在過去;如果你焦慮,說明活 在未來;如果你平靜,說明活在當下。遇爛人及時止損,遇爛事及時抽身。人一定要有「翻篇」的能力,向內探索,活好自己。","⭐⭐⭐"],
[193,"","快樂秘密:無所謂","除了生病,你感受到的痛苦都是情緒帶來的,而非真實存在。保持快樂的秘密就是「無所謂」:愛誰誰、沒必要、不至於。不要相信壓力能變動力,壓力只會轉變成病歷。","⭐⭐⭐"],
[194,"🚨 心靈急救箱","曠野心態：自定義意義","人生是一片曠野，不是一條固定的軌道。不需要按部就班遵循世俗標準（幾歲要成功、要買房）。吃喝玩樂不等於浪費時間，你的感受和體驗就是專屬意義。這世界就你一個人，你在，世界就在。",""],
[195,"","底氣：自己是自己的靠山","小事要穩，大事要狠，沒人扶的時候要自己站穩。 處境再艱難也別掛在嘴邊，壓力再深沉也別輕易抱怨。若自己有本事，所有人都想找你做靠山。你最好的貴人，就是那個大氣向上的自己。",""],
[196,"","來日方長 vs 世事無常","昨天離世的人，或許還在規劃今天。 誰也不知道下一秒會發生什麼。那些以為的「來日方長」，轉眼就成了「世事無常」。別總是在「等以後」，你在，世界就在；此時此刻的平安與體驗，就是活著唯一的意義。","⭐⭐⭐"],
[197,"🚨 心靈急救箱","公司「沒你也行」是福氣","地球少了誰都轉，公司沒了你也照樣運作。 承認這一點，不是否定你的價值，而是要把你從「救世主」的幻覺中解放出來。公司是別人的，命是自己的；你是工廠的副總，更是你自己的主理人。","⭐⭐⭐"],
[198,"🚨 心靈急救箱","下班即「下崗」","脫下工服那一刻,工廠的 2000人就與你無關了。 不要用公司的問題來懲罰當下的自己。如果你現在不開心,工廠的產能也不會變高。把工作的憂慮留給明天的辦公桌,現在的你,只負責「呼吸」和 「休息」。","⭐⭐⭐"],
[199,"","沒那麼重要,才最舒服","「沒人看你」其實是這世界上最自由的事。既然沒幾個人真的在乎你,你又何必在乎那些帶不走的煩惱?放下「被需要」的執念。現在就去做一件毫無意義的事:喝杯茶、看窗 外、發個呆。這才是你此時此刻真正的「KPI」。","⭐⭐⭐"]
];

// Trigger → wisdom index mapping
const TRIG_MAP = {
  work:    [54,55,56,57,58,59,60,61,62,63,89,90],
  express: [64,65,66,67,68,37,30,84,85,86],
  english: [69,70,71,72,73,74,75,76,100,83],
  doubt:   [74,75,76,36,51,99,69,70,72],
  behind:  [59,60,61,62,63,10,33,32,35],
  compare: [77,78,79,80,81,34,39,43,46],
  expect:  [10,29,31,40,51,88,95],
  value:   [21,22,23,24,27,82,93,94],
  family:  [11,12,14,17,41,42,46,47],
  routine: [10,16,17,18,28,32,41,48,49],
};

const TRIGGERS = [
  {id:"work",emoji:"😰",label:"擔心工作"},
  {id:"express",emoji:"🫨",label:"表達不好/緊張"},
  {id:"english",emoji:"🇬🇧",label:"英文/自卑"},
  {id:"doubt",emoji:"❓",label:"能力被質疑"},
  {id:"behind",emoji:"📉",label:"工作進度落後"},
  {id:"compare",emoji:"👥",label:"與人比較/競爭"},
  {id:"expect",emoji:"🎯",label:"自我期許過高"},
  {id:"value",emoji:"💎",label:"失去價值/沒有存在感"},
  {id:"family",emoji:"🏠",label:"家庭生活"},
  {id:"routine",emoji:"🌀",label:"沒有規律生活"},
];
const STATE_TAGS = ["完美主義陷阱","防衛心理","自我價值疑慮","認知扭曲：讀心術","自我否定","災難預測"];
const ASSET_CATS = [
  {id:"tech",emoji:"💻",label:"技術突破"},{id:"english",emoji:"🇬🇧",label:"英文進步"},
  {id:"manage",emoji:"🤝",label:"管理心法"},{id:"workout",emoji:"🏋️",label:"身體鍛鍊"},
  {id:"speech",emoji:"🎙️",label:"複讀訓練口才"},{id:"body",emoji:"💪",label:"身體重塑"},
  {id:"kind",emoji:"🤲",label:"隨機善行"},{id:"present",emoji:"☕",label:"品味當下"},
  {id:"posit",emoji:"🧠",label:"正向語法"},{id:"flow",emoji:"🛠️",label:"進入心流"},
  {id:"good3",emoji:"✨",label:"三件好事"},
];

const DEFAULT = {
  actions:["大力拍手一次","4-7-8深呼吸","做10下深蹲","用冷水洗臉","大聲說「停！換台」"],
  anchor:"想像最佳狀態的自己，雙手舉高30秒",
  records:[],assets:[],customWisdom:[],
};

async function loadApp() {
  try { const r=await window.storage.get(SK); return r?JSON.parse(r.value):DEFAULT; }
  catch { return DEFAULT; }
}
async function saveApp(d) { try{await window.storage.set(SK,JSON.stringify(d));}catch{} }
const today=()=>new Date().toISOString().slice(0,10);
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,5);

// ── Google Sheets 寫入（Image 標籤法，最可靠的跨域方式）──────────
const GS_DIRECT = "https://script.google.com/macros/s/AKfycbyxh1ZZhMratAZoUojK9BHWcX5YRsotzAErHLA0zJ7NCE8uGrOI9xVSMtqAqPvbt0vusQ/exec";

function gsPost(sheet, row) {
  try {
    const params = new URLSearchParams({
      action: "write",
      sheet: sheet,
      row: JSON.stringify(row),
    });
    // Image 標籤不受 CORS 限制，可跨域發送 GET 請求
    const img = new window.Image();
    img.src = `${GS_DIRECT}?${params.toString()}`;
  } catch(e) {}
}

// ── Google Sheets 讀取智慧錦囊 ────────────────────────────────────
async function gsGetWisdom() {
  try {
    const params = new URLSearchParams({ action: "read", sheet: "Wisdom_DB" });
    const res = await fetch(`${GS_DIRECT}?${params.toString()}`);
    const json = await res.json();
    if (json.data && json.data.length > 0) {
      return json.data.map((r, i) => ({
        id: i,
        cat: r["類別 Category"] || "",
        title: r["標題 Title"] || "",
        content: r["內容 Content"] || "",
        star: r["靈魂標記 Star"] || "",
        custom: false,
      }));
    }
  } catch {}
  return null;
}
const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="100" fill="#080d14"/><rect width="512" height="512" rx="100" fill="url(#g)"/><defs><radialGradient id="g" cx="30%" cy="20%"><stop offset="0%" stop-color="#00d4ff" stop-opacity=".25"/><stop offset="100%" stop-color="#080d14" stop-opacity="0"/></radialGradient></defs><polygon points="290,60 130,280 256,280 222,460 400,220 274,220" fill="#00d4ff" filter="drop-shadow(0 0 20px #00d4ff)"/></svg>`;
const ICON_192 = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(ICON_SVG)))}`;
const ICON_512 = ICON_192;

// ── Breathing ─────────────────────────────────────────────────────
function Breath({onDone}) {
  const PH=[{l:"吸氣",d:4,c:"#00d4ff"},{l:"屏息",d:7,c:"#a78bfa"},{l:"吐氣",d:8,c:"#34d399"}];
  const [pi,setPi]=useState(0);
  const [s,setS]=useState(4);
  const [cy,setCy]=useState(0);
  useEffect(()=>{
    if(cy>=2){onDone();return;}
    const t=setInterval(()=>{
      setS(v=>{
        if(v<=1){
          const n=(pi+1)%3;
          setPi(n);
          if(n===0)setCy(x=>x+1);
          return PH[n].d;
        }
        return v-1;
      });
    },1000);
    return ()=>clearInterval(t);
  },[pi,cy]); // eslint-disable-line
  const p=PH[pi], pct=((p.d-s)/p.d)*100;
  return <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
    <svg width="96" height="96" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r="40" fill="none" stroke="#1e293b" strokeWidth="5"/>
      <circle cx="48" cy="48" r="40" fill="none" stroke={p.c} strokeWidth="5" strokeLinecap="round"
        strokeDasharray={`${2*Math.PI*40}`}
        strokeDashoffset={`${2*Math.PI*40*(1-pct/100)}`}
        style={{transform:"rotate(-90deg)",transformOrigin:"48px 48px",transition:"stroke-dashoffset 1s linear"}}/>
      <text x="48" y="44" textAnchor="middle" fill={p.c} fontSize="20" fontWeight="700" fontFamily="monospace">{s}</text>
      <text x="48" y="60" textAnchor="middle" fill="#94a3b8" fontSize="11">{p.l}</text>
    </svg>
    <span style={{fontSize:11,color:"#64748b"}}>第{cy+1}/2輪 · 4-7-8</span>
  </div>;
}

// ── Asset Form ─────────────────────────────────────────────────────
function AssetForm({init,onSave,onClose}) {
  const [cat,setCat]=useState(init?.cat??"");
  const [content,setContent]=useState(init?.content??"");
  const [date,setDate]=useState(init?.date??today());
  const [open,setOpen]=useState(false);
  const sel=ASSET_CATS.find(c=>c.id===cat);
  function save(){if(!content.trim())return;onSave({id:init?.id??uid(),date,cat,content:content.trim()});}
  return <div className="overlay"><div className="modal">
    <h3 className="modal-h">{init?"編輯成就":"記錄新成就"}</h3>
    <div className="ff"><label>日期</label><input type="date" className="fi" value={date} onChange={e=>setDate(e.target.value)}/></div>
    <div className="ff"><label>資產類別</label>
      <button className="dd-btn" onClick={()=>setOpen(v=>!v)}>
        {sel?`${sel.emoji} ${sel.label}`:<span style={{color:"#64748b"}}>選擇類別…</span>}
        <span style={{marginLeft:"auto",fontSize:10,color:"#64748b"}}>▼</span>
      </button>
      {open&&<div className="dd-list">{ASSET_CATS.map(c=><button key={c.id} className={`ddi ${cat===c.id?"s":""}`} onClick={()=>{setCat(c.id);setOpen(false);}}>{c.emoji} {c.label}</button>)}</div>}
    </div>
    <div className="ff"><label>具體內容</label>
      <textarea className="fi" style={{height:80,resize:"none"}} placeholder="今天突破了什麼？幫助了誰？有何體悟？" value={content} onChange={e=>setContent(e.target.value)}/>
    </div>
    <div style={{display:"flex",gap:8}}>
      <button className="sb" onClick={onClose}>取消</button>
      <button className="gb" onClick={save}>儲存</button>
    </div>
  </div></div>;
}

// ── Main ───────────────────────────────────────────────────────────
export default function App() {
  const [app,setApp]=useState(null);
  const [tab,setTab]=useState("scan");
  const [flow,setFlow]=useState("idle");
  const [trig,setTrig]=useState(null);
  const [stateTag,setStateTag]=useState("");
  const [stars,setStars]=useState(0);
  const [selW,setSelW]=useState(null);
  const [aIdx,setAIdx]=useState(0);
  const [breath,setBreath]=useState(false);
  const [wSearch,setWSearch]=useState("");
  const [wCat,setWCat]=useState("all");
  const [assetForm,setAssetForm]=useState(null);
  const [assetFilt,setAssetFilt]=useState("all");
  const [newAct,setNewAct]=useState("");
  const [editAnch,setEditAnch]=useState(false);
  const [newAnch,setNewAnch]=useState("");
  const [newWT,setNewWT]=useState("");
  const [newWX,setNewWX]=useState("");
  const [gsWisdom,setGsWisdom]=useState(null);

  useEffect(()=>{loadApp().then(setApp);},[]);
  useEffect(()=>{if(app)saveApp(app);},[app]);
  // 從 Google Sheets 載入最新智慧錦囊（背景更新）
  useEffect(()=>{
    gsGetWisdom().then(data=>{ if(data&&data.length>0) setGsWisdom(data); });
  },[]);

  // PWA: fullscreen + icons
  useEffect(()=>{
    // viewport fullscreen
    let vp=document.querySelector('meta[name="viewport"]');
    if(!vp){vp=document.createElement('meta');vp.name='viewport';document.head.appendChild(vp);}
    vp.content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover';
    // theme color
    let tc=document.querySelector('meta[name="theme-color"]');
    if(!tc){tc=document.createElement('meta');tc.name='theme-color';document.head.appendChild(tc);}
    tc.content='#080d14';
    // apple mobile web app
    const metas=[
      ['apple-mobile-web-app-capable','yes'],
      ['apple-mobile-web-app-status-bar-style','black-translucent'],
      ['apple-mobile-web-app-title','負面阻斷器'],
      ['mobile-web-app-capable','yes'],
    ];
    metas.forEach(([n,c])=>{
      let m=document.querySelector(`meta[name="${n}"]`);
      if(!m){m=document.createElement('meta');m.name=n;document.head.appendChild(m);}
      m.content=c;
    });
    // PWA manifest inline
    const manifest={
      name:'負面阻斷器',short_name:'阻斷器',
      description:'重寫大腦神經路徑 · 智慧錦囊系統',
      start_url:'.',display:'fullscreen',
      background_color:'#080d14',theme_color:'#080d14',
      orientation:'portrait',
      icons:[
        {src:ICON_192,sizes:'192x192',type:'image/png',purpose:'any maskable'},
        {src:ICON_512,sizes:'512x512',type:'image/png',purpose:'any maskable'},
      ]
    };
    const blob=new Blob([JSON.stringify(manifest)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    let ml=document.querySelector('link[rel="manifest"]');
    if(!ml){ml=document.createElement('link');ml.rel='manifest';document.head.appendChild(ml);}
    ml.href=url;
    // apple touch icon
    let ai=document.querySelector('link[rel="apple-touch-icon"]');
    if(!ai){ai=document.createElement('link');ai.rel='apple-touch-icon';document.head.appendChild(ai);}
    ai.href=ICON_192;
    // safe area padding for notch/home indicator
    document.documentElement.style.setProperty('--sat','env(safe-area-inset-top)');
    document.documentElement.style.setProperty('--sab','env(safe-area-inset-bottom)');
    return ()=>URL.revokeObjectURL(url);
  },[]);

  // 智慧錦囊：優先用 Google Sheets 最新版，否則用內建 200 條
  const customLen = app?.customWisdom?.length ?? 0;
  const gsLen = gsWisdom?.length ?? 0;
  const allWisdom = useMemo(()=>{
    const base = gsLen > 0
      ? gsWisdom
      : WISDOM_SEED.map(([i,c,t,x,s])=>({id:i,cat:c,title:t,content:x,star:s,custom:false}));
    if(!app) return base;
    const custom=(app.customWisdom||[]).map((w,i)=>({...w,id:`c${i}`,custom:true}));
    return [...base,...custom];
  },[gsLen,customLen]); // eslint-disable-line

  // Filtered wisdom (stable deps)
  const filtWisdom = useMemo(()=>{
    let list = allWisdom;
    if(wCat!=="all") list=list.filter(w=>w.cat===wCat);
    if(wSearch.trim()) list=list.filter(w=>w.title.includes(wSearch)||w.content.includes(wSearch));
    return list;
  },[allWisdom,wCat,wSearch]);

  const recForTrig = useCallback((tid)=>{
    const idxs = TRIG_MAP[tid]||[];
    const matched = idxs.map(i=>allWisdom[i]).filter(Boolean);
    return [...matched.filter(w=>w.star),...matched.filter(w=>!w.star)];
  },[allWisdom]);

  if(!app) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",color:"#64748b"}}>載入中…</div>;

  const todayRec = app.records.filter(r=>r.date===today());
  const todayBlocked = todayRec.filter(r=>r.blocked).length;
  const totalBlocked = app.records.filter(r=>r.blocked).length;
  const cats = [...new Set(allWisdom.map(w=>w.cat).filter(Boolean))];

  function startFlow(t) {
    setTrig(t); setStateTag(""); setStars(0); setSelW(null);
    setAIdx(Math.floor(Math.random()*app.actions.length));
    setBreath(false); setFlow("step1"); setTab("blocker");
  }
  function completeBlock() {
    const rec={id:uid(),date:today(),trigger:trig.id,stateTag,stars,wisdomId:selW?.id??null,blocked:true};
    // 本地儲存
    setApp(d=>({...d,records:[...d.records,rec]}));
    setFlow("done");
    // 同步到 Google Sheets（背景執行，不阻塞 UI）
    const wisdomTitle = selW?.title ?? "";
    gsPost("Blocker_Records", {
      "Record_ID": rec.id,
      "記錄日期 Date": rec.date,
      "情境觸發 Trigger": rec.trigger,
      "狀態標籤 State_Tag": rec.stateTag,
      "身體動作 Action": app.actions[aIdx] || "",
      "使用錦囊ID Wisdom_ID": selW ? `W${String(selW.id+1).padStart(3,"0")}` : "",
      "錦囊標題 Wisdom_Title": wisdomTitle,
      "執行良率 Stars": rec.stars,
      "是否完成阻斷 Blocked": "TRUE",
      "備註 Note": "",
    });
  }
  function logOnly() {
    const rec={id:uid(),date:today(),trigger:trig.id,stateTag,stars:0,wisdomId:null,blocked:false};
    setApp(d=>({...d,records:[...d.records,rec]}));
    gsPost("Blocker_Records", {
      "Record_ID": rec.id,
      "記錄日期 Date": rec.date,
      "情境觸發 Trigger": rec.trigger,
      "狀態標籤 State_Tag": rec.stateTag,
      "身體動作 Action": "",
      "使用錦囊ID Wisdom_ID": "",
      "錦囊標題 Wisdom_Title": "",
      "執行良率 Stars": "0",
      "是否完成阻斷 Blocked": "FALSE",
      "備註 Note": "僅記錄",
    });
    setFlow("idle");
  }
  function reset(){setFlow("idle");setBreath(false);setSelW(null);}

  function saveAsset(rec){
    const cat = ASSET_CATS.find(c=>c.id===rec.cat);
    setApp(d=>{
      const ex=d.assets.find(a=>a.id===rec.id);
      return ex?{...d,assets:d.assets.map(a=>a.id===rec.id?rec:a)}:{...d,assets:[...d.assets,rec]};
    });
    // 同步到 Google Sheets
    gsPost("Success_Assets", {
      "Asset_ID": rec.id,
      "日期 Date": rec.date,
      "資產類別 Category": cat ? `${cat.emoji} ${cat.label}` : rec.cat,
      "具體內容 Content": rec.content,
      "心情指數 Mood": "",
      "關聯情境 Related_Trigger": "",
      "建立時間 Created_At": new Date().toLocaleString("zh-TW"),
    });
    setAssetForm(null);
  }
  function addCustomW(){
    if(!newWT.trim()||!newWX.trim())return;
    setApp(d=>({...d,customWisdom:[...(d.customWisdom||[]),{id:uid(),cat:"💡 自定義",title:newWT.trim(),content:newWX.trim(),star:""}]}));
    setNewWT(""); setNewWX("");
  }

  const trigStats = TRIGGERS.map(t=>({...t,count:app.records.filter(r=>r.trigger===t.id).length})).sort((a,b)=>b.count-a.count);
  const maxT = Math.max(...trigStats.map(t=>t.count),1);
  const wUsage = app.records.filter(r=>r.wisdomId!=null).reduce((a,r)=>{a[r.wisdomId]=(a[r.wisdomId]||0)+1;return a;},{});
  const topW = Object.entries(wUsage).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([id,cnt])=>({...allWisdom.find(w=>String(w.id)===String(id)),cnt})).filter(w=>w?.title);

  function calcStreak(){
    const dates=[...new Set(app.records.filter(r=>r.blocked).map(r=>r.date))].sort().reverse();
    if(!dates.length)return 0;
    let st=0,d=new Date();d.setHours(0,0,0,0);
    for(const ds of dates){const df=Math.round((d-new Date(ds+"T00:00:00"))/86400000);if(df<=st+1)st=df+1;else break;}
    return Math.max(0,st);
  }

  const C3 = ["#00d4ff","#a78bfa","#34d399"];

  return <>
    <style>{CSS}</style>
    <div className="app">

      {/* Header */}
      <header>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <span style={{fontSize:22,filter:"drop-shadow(0 0 6px #00d4ff88)"}}>⚡</span>
          <div>
            <div style={{fontSize:15,fontWeight:700}}>負面阻斷器</div>
            <div style={{fontSize:9,color:"var(--c)",fontFamily:"monospace",letterSpacing:".04em"}}>
              智慧錦囊 · 重寫神經路徑 · {allWisdom.length}條
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <div className="sp"><span className="sn">{todayBlocked}</span><span className="sl">今日</span></div>
          <div className="sp gold"><span className="sn" style={{color:"var(--g)"}}>{totalBlocked}</span><span className="sl">累計</span></div>
        </div>
      </header>

      {/* Nav */}
      <nav>
        {[["scan","📡","巡檢"],["blocker","⚡","阻斷"],["wisdom","💡","錦囊"],["assets","🏆","資產"],["stats","📊","分析"]].map(([id,ic,lb])=>(
          <button key={id} className={`nb ${tab===id?"on":""}`} onClick={()=>{setTab(id);if(id!=="blocker")reset();}}>
            <span style={{fontSize:16}}>{ic}</span><span>{lb}</span>
          </button>
        ))}
      </nav>

      {/* ═ 情緒巡檢 ═ */}
      {tab==="scan" && <div className="panel">
        <div className="sh">📡 <span>現在哪種情緒觸發了你？</span></div>
        <p style={{fontSize:11,color:"#64748b",marginBottom:10}}>選擇情境 → 自動推薦智慧錦囊 → 啟動三層阻斷</p>
        <div className="tg">
          {TRIGGERS.map(t=>{
            const cnt=app.records.filter(r=>r.trigger===t.id).length;
            return <button key={t.id} className="tb" onClick={()=>startFlow(t)}>
              <span style={{fontSize:16}}>{t.emoji}</span>
              <div><div style={{fontSize:11,color:"var(--tx)",lineHeight:1.3}}>{t.label}</div>
                {cnt>0&&<div style={{fontSize:9,color:"var(--mt)"}}>已觸發{cnt}次</div>}
              </div>
            </button>;
          })}
        </div>
        {todayRec.length>0&&<>
          <div className="sh" style={{marginTop:16}}>📋 <span>今日記錄</span></div>
          {[...todayRec].reverse().map(r=>{
            const t=TRIGGERS.find(x=>x.id===r.trigger);
            const w=r.wisdomId!=null?allWisdom.find(x=>x.id===r.wisdomId):null;
            return <div className="ri" key={r.id}>
              <span style={{fontSize:16}}>{t?.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:12}}>{t?.label}</div>
                {w&&<div style={{fontSize:10,color:"var(--p)",marginTop:1}}>💡 {w.title}</div>}
              </div>
              {r.blocked?<span className="badge g">✓ 阻斷</span>:<span className="badge">記錄</span>}
            </div>;
          })}
        </>}
      </div>}

      {/* ═ 阻斷程序 ═ */}
      {tab==="blocker" && <div className="panel">
        {flow==="idle"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"36px 0",gap:16}}>
          <div className="sos-ring">
            <button className="sos-btn" onClick={()=>setTab("scan")}>
              <span style={{fontSize:32}}>⚡</span>
              <span style={{fontSize:11,color:"var(--c)",fontWeight:600}}>前往巡檢</span>
            </button>
          </div>
          <p style={{textAlign:"center",color:"var(--mt)",fontSize:12,lineHeight:1.7}}>先在「情緒巡檢」選擇情境<br/>系統會自動推薦對應智慧錦囊</p>
        </div>}

        {["step1","step2","step3"].includes(flow)&&(()=>{
          const step=flow==="step1"?1:flow==="step2"?2:3;
          const col=C3[step-1];
          return <div className="sc">
            <div className="tb-badge">{trig?.emoji} {trig?.label}</div>

            {flow==="step1"&&<>
              <div><div className="fl">狀態標籤（選填）</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {STATE_TAGS.map(s=><button key={s} className={`chip ${stateTag===s?"on":""}`} onClick={()=>setStateTag(t=>t===s?"":s)}>{s}</button>)}
                </div>
              </div>
              <div className="sb2" style={{borderColor:col+"44"}}>
                <div style={{fontSize:10,color:col,fontFamily:"monospace"}}>第1層 · 身體阻斷 · 0-10秒</div>
                <div style={{fontSize:16,fontWeight:700,color:col}}>{app.actions[aIdx]}</div>
                {!breath?<button className="eb" onClick={()=>setBreath(true)}>🫁 改用 4-7-8 呼吸</button>
                  :<Breath onDone={()=>{setBreath(false);setFlow("step2");}}/>}
              </div>
              <div style={{display:"flex",gap:8}}>
                <button className="sb" onClick={logOnly}>僅記錄</button>
                <button className="nb2" style={{background:col,flex:1}} onClick={()=>setFlow("step2")}>完成 →</button>
              </div>
            </>}

            {flow==="step2"&&<>
              <div className="sb2" style={{borderColor:col+"44"}}>
                <div style={{fontSize:10,color:col,fontFamily:"monospace"}}>第2層 · 認知重導 · 10-60秒</div>
                {selW
                  ?<div style={{background:"rgba(167,139,250,.08)",borderRadius:8,padding:"10px 12px",border:"1px solid rgba(167,139,250,.25)"}}>
                    <div style={{fontSize:10,color:"var(--p)",marginBottom:4}}>{selW.cat} {selW.star}</div>
                    <div style={{fontSize:14,fontWeight:700,color:"var(--p)",marginBottom:6}}>「{selW.title}」</div>
                    <div style={{fontSize:12,color:"var(--tx)",lineHeight:1.6}}>{selW.content}</div>
                  </div>
                  :<div style={{textAlign:"center",color:"var(--mt)",fontSize:12,padding:"12px",background:"rgba(255,255,255,.03)",borderRadius:8,border:"1px dashed var(--bd)"}}>
                    👇 請選擇一條智慧錦囊，大聲朗讀它
                  </div>
                }
                <button className="eb" onClick={()=>setFlow("wsel")}>{selW?"🔄 更換錦囊":"💡 選擇智慧錦囊"}</button>
              </div>
              <p style={{fontSize:11,color:"var(--mt)",textAlign:"center"}}>把「為什麼這麼糟」→「我能從中得到什麼？」</p>
              <button className="nb2" style={{background:col}} onClick={()=>setFlow("step3")}>完成 →</button>
            </>}

            {flow==="step3"&&<>
              <div className="sb2" style={{borderColor:col+"44"}}>
                <div style={{fontSize:10,color:col,fontFamily:"monospace"}}>第3層 · 情緒錨定 · 1-3分鐘</div>
                <div style={{fontSize:16,fontWeight:700,color:col}}>{app.anchor}</div>
                <div style={{fontSize:11,color:"var(--mt)"}}>雙手高舉30秒，閉眼清晰想像</div>
              </div>
              <div><div className="fl">執行後良率</div>
                <div style={{display:"flex",gap:8}}>
                  {[1,2,3,4,5].map(n=><button key={n} className={`star-btn ${stars>=n?"lit":""}`} onClick={()=>setStars(n)}>★</button>)}
                </div>
              </div>
              <button className="nb2" style={{background:col}} onClick={completeBlock}>完成阻斷 ✓</button>
            </>}

            <div style={{display:"flex",gap:6,justifyContent:"center"}}>
              {[1,2,3].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:i<=step?C3[i-1]:"var(--sur2)",border:`1px solid ${i<=step?C3[i-1]:"var(--bd)"}`,transition:"all .3s"}}/>)}
            </div>
          </div>;
        })()}

        {flow==="wsel"&&<div className="sc" style={{gap:10}}>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button className="sb" style={{padding:"7px 12px"}} onClick={()=>setFlow("step2")}>← 返回</button>
            <span style={{fontSize:12,fontWeight:600}}>為「{trig?.label}」推薦的錦囊</span>
          </div>
          <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>
            {recForTrig(trig?.id||"work").map(w=>(
              <button key={w.id} onClick={()=>{setSelW(w);setFlow("step2");}}
                className={`wc2 ${selW?.id===w.id?"on":""}`}>
                <div className="wc-cat">{w.cat}</div>
                <div className="wc-title">{w.title}</div>
                {w.star&&<div className="wc-star">{w.star}</div>}
              </button>
            ))}
          </div>
          <div className="sbar">
            🔍 <input placeholder="搜尋全部錦囊…" value={wSearch} onChange={e=>setWSearch(e.target.value)}/>
          </div>
          {wSearch&&<div style={{maxHeight:280,overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>
            {filtWisdom.slice(0,20).map(w=>(
              <div key={w.id} className={`wc1 ${selW?.id===w.id?"on":""}`}
                onClick={()=>{setSelW(w);setFlow("step2");}}>
                <div style={{display:"flex",gap:6,marginBottom:4}}>
                  <span className="cat-badge">{w.cat||"💡"}</span>
                  {w.star&&<span style={{fontSize:11,color:"var(--g)",marginLeft:"auto"}}>{w.star}</span>}
                </div>
                <div style={{fontSize:13,fontWeight:700,marginBottom:3}}>{w.title}</div>
                <div style={{fontSize:11,color:"#94a3b8",lineHeight:1.5}}>{w.content}</div>
              </div>
            ))}
          </div>}
        </div>}

        {flow==="done"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"24px 0",animation:"su .3s ease-out"}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:"radial-gradient(circle,rgba(52,211,153,.3),transparent)",border:"2px solid var(--gr)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,color:"var(--gr)"}}>✓</div>
          <div style={{fontSize:20,color:"var(--gr)",fontWeight:700}}>阻斷成功！</div>
          <div style={{textAlign:"center",color:"var(--mt)",fontSize:13,lineHeight:1.7}}>神經路徑正在重塑<br/>又鋪了一段新的正面高速公路</div>
          {selW&&<div className="rw">💡 錦囊：{selW.title}</div>}
          {stars>0&&<div className="rw">{"★".repeat(stars)} 良率已記錄</div>}
          <div style={{display:"flex",gap:8,width:"100%"}}>
            <button className="sb" style={{flex:1}} onClick={()=>{reset();setTab("scan");}}>返回巡檢</button>
            <button className="gb" style={{flex:1}} onClick={()=>{reset();setTab("assets");setAssetForm("new");}}>✨ 記錄成就</button>
          </div>
        </div>}
      </div>}

      {/* ═ 智慧錦囊 ═ */}
      {tab==="wisdom"&&<div className="panel">
        <div style={{textAlign:"center",background:"var(--sur)",border:"1px solid var(--bd)",borderRadius:12,padding:"14px",marginBottom:12}}>
          <div style={{fontSize:48,fontWeight:700,fontFamily:"monospace",color:"var(--p)",textShadow:"0 0 20px rgba(167,139,250,.4)"}}>{allWisdom.length}</div>
          <div style={{fontSize:11,color:"var(--mt)"}}>智慧錦囊總數 · 內建{WISDOM_SEED.length}條 + 自定義{customLen}條</div>
        </div>
        <div className="sbar"><span>🔍</span> <input placeholder="搜尋標題、內容…" value={wSearch} onChange={e=>setWSearch(e.target.value)}/></div>
        <div className="fs">
          <button className={`fp ${wCat==="all"?"on":""}`} onClick={()=>setWCat("all")}>全部</button>
          {cats.slice(0,12).map(c=><button key={c} className={`fp ${wCat===c?"on":""}`} onClick={()=>setWCat(c)}>{c}</button>)}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:14}}>
          {filtWisdom.slice(0,40).map(w=>(
            <div key={`${w.id}-${w.custom}`} className="wc1">
              <div style={{display:"flex",gap:6,marginBottom:4,alignItems:"center"}}>
                <span className="cat-badge">{w.cat||"💡 自定義"}</span>
                {w.star&&<span style={{fontSize:11,color:"var(--g)"}}>{w.star}</span>}
                {w.custom&&<button className="xb" onClick={()=>setApp(d=>({...d,customWisdom:(d.customWisdom||[]).filter(c=>c.id!==w.id)}))}>✕</button>}
              </div>
              <div style={{fontSize:13,fontWeight:700,marginBottom:3}}>{w.title}</div>
              <div style={{fontSize:11,color:"#94a3b8",lineHeight:1.5}}>{w.content}</div>
            </div>
          ))}
          {filtWisdom.length>40&&<p style={{textAlign:"center",fontSize:11,color:"var(--mt)"}}>顯示前40條，請搜尋縮小範圍</p>}
        </div>
        <div style={{background:"var(--sur)",border:"1px solid var(--bd)",borderRadius:12,padding:14,display:"flex",flexDirection:"column",gap:8}}>
          <div className="sh">➕ <span>新增自訂錦囊</span></div>
          <input className="fi" placeholder="標題" value={newWT} onChange={e=>setNewWT(e.target.value)}/>
          <textarea className="fi" style={{height:64,resize:"none"}} placeholder="錦囊內容…" value={newWX} onChange={e=>setNewWX(e.target.value)}/>
          <button className="pw" onClick={addCustomW}>新增錦囊</button>
        </div>
      </div>}

      {/* ═ 成功資產 ═ */}
      {tab==="assets"&&<div className="panel">
        <div style={{background:"var(--sur)",border:"1px solid var(--bd)",borderRadius:12,padding:16,display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:48,fontWeight:700,fontFamily:"monospace",color:"var(--gd)",textShadow:"0 0 20px rgba(245,158,11,.4)"}}>{app.assets.length}</div>
            <div style={{fontSize:11,color:"var(--mt)"}}>累積資產</div>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,flex:1}}>
            {ASSET_CATS.filter(c=>app.assets.some(a=>a.cat===c.id)).slice(0,6).map(c=>(
              <div key={c.id} style={{background:"rgba(245,158,11,.1)",border:"1px solid rgba(245,158,11,.2)",borderRadius:8,padding:"3px 7px",fontSize:12}}>{c.emoji} {app.assets.filter(a=>a.cat===c.id).length}</div>
            ))}
          </div>
        </div>
        <button className="add-a" onClick={()=>setAssetForm("new")}>➕ 記錄新成就</button>
        <div className="fs">
          <button className={`fp ${assetFilt==="all"?"on":""}`} onClick={()=>setAssetFilt("all")}>全部 {app.assets.length}</button>
          {ASSET_CATS.filter(c=>app.assets.some(a=>a.cat===c.id)).map(c=>(
            <button key={c.id} className={`fp ${assetFilt===c.id?"on":""}`} onClick={()=>setAssetFilt(c.id)}>{c.emoji} {c.label}</button>
          ))}
        </div>
        {[...app.assets].filter(a=>assetFilt==="all"||a.cat===assetFilt).sort((a,b)=>b.date.localeCompare(a.date)).map(a=>{
          const cat=ASSET_CATS.find(c=>c.id===a.cat);
          return <div className="ac" key={a.id}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{display:"flex",gap:5,alignItems:"center"}}>
                <span style={{fontSize:16}}>{cat?.emoji||"📝"}</span>
                <span style={{fontSize:11,color:"var(--gd)",background:"rgba(245,158,11,.1)",borderRadius:5,padding:"1px 6px"}}>{cat?.label||"未分類"}</span>
              </div>
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                <span style={{fontSize:10,color:"var(--mt)",fontFamily:"monospace"}}>{a.date.replace(/-/g,"/")}</span>
                <button className="xb" onClick={()=>setAssetForm(a)}>✎</button>
                <button className="xb red" onClick={()=>setApp(d=>({...d,assets:d.assets.filter(x=>x.id!==a.id)}))}>✕</button>
              </div>
            </div>
            <div style={{fontSize:12,color:"var(--tx)",lineHeight:1.65}}>{a.content}</div>
          </div>;
        })}
        {app.assets.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:"var(--mt)"}}>🌱 尚無記錄，開始記錄你的每日成就</div>}
      </div>}

      {/* ═ 數據分析 ═ */}
      {tab==="stats"&&<div className="panel">
        <div style={{background:"var(--sur)",border:"1px solid var(--bd)",borderRadius:12,padding:"12px 14px",marginBottom:14,display:"flex",gap:0}}>
          {[
            {label:"累計阻斷",val:totalBlocked,color:"var(--c)",bg:"rgba(0,212,255,.08)",border:"rgba(0,212,255,.25)"},
            {label:"今日阻斷",val:todayBlocked,color:"var(--gr)",bg:"rgba(52,211,153,.08)",border:"rgba(52,211,153,.25)"},
            {label:"連續天數",val:`${calcStreak()}`,color:"#fb923c",bg:"rgba(251,146,60,.08)",border:"rgba(251,146,60,.25)"},
            {label:"資產累積",val:app.assets.length,color:"var(--gd)",bg:"rgba(245,158,11,.08)",border:"rgba(245,158,11,.25)"},
          ].map((s,i)=>(
            <div key={i} style={{flex:1,textAlign:"center",padding:"8px 4px",borderRight:i<3?"1px solid var(--bd)":"none"}}>
              <div style={{fontSize:22,fontWeight:700,fontFamily:"monospace",color:s.color}}>{s.val}</div>
              <div style={{fontSize:9,color:"var(--mt)",marginTop:2,lineHeight:1.2}}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="sh">🛣️ <span>負面高速公路佔比</span></div>
        <p style={{fontSize:11,color:"var(--mt)",marginBottom:10}}>次數越多 = 神經路徑越強，需優先重塑</p>
        <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20}}>
          {trigStats.filter(t=>t.count>0).length===0
            ?<div style={{textAlign:"center",color:"var(--mt)",padding:"20px 0",fontSize:12}}>尚無記錄</div>
            :trigStats.filter(t=>t.count>0).map((t,i)=>(
              <div key={t.id} style={{background:"var(--sur)",border:`1px solid ${i===0?"rgba(248,113,113,.35)":"var(--bd)"}`,borderRadius:10,padding:"10px 12px",background:i===0?"rgba(248,113,113,.05)":"var(--sur)"}}>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                  <span style={{fontSize:16}}>{t.emoji}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600}}>{t.label}</div>
                    <div style={{fontSize:10,color:"var(--mt)"}}>
                      觸發 {t.count} 次
                      {i===0&&<span style={{background:"rgba(248,113,113,.15)",color:"#f87171",borderRadius:4,padding:"1px 5px",fontSize:9,marginLeft:4}}>最強</span>}
                    </div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{flex:1,height:5,background:"rgba(255,255,255,.07)",borderRadius:3,overflow:"hidden"}}>
                    <div style={{width:`${Math.round(t.count/maxT*100)}%`,height:"100%",background:i===0?"#f87171":"var(--c)",borderRadius:3,transition:"width .6s"}}/>
                  </div>
                  <span style={{fontSize:10,color:"var(--mt)",fontFamily:"monospace"}}>{Math.round(t.count/maxT*100)}%</span>
                </div>
              </div>
            ))
          }
        </div>

        {topW.length>0&&<>
          <div className="sh">💡 <span>最常用智慧錦囊 Top5</span></div>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
            {topW.map((w,i)=><div key={i} className="wc1" style={{padding:"14px 16px"}}>
              <div style={{display:"flex",gap:6,marginBottom:8,alignItems:"center"}}>
                <span className="cat-badge" style={{fontSize:11,padding:"2px 8px"}}>{w.cat||"💡"}</span>
                <span style={{fontSize:12,color:"var(--gd)",marginLeft:"auto",fontWeight:600}}>使用 {w.cnt} 次</span>
              </div>
              <div style={{fontSize:16,fontWeight:700,marginBottom:6,color:"var(--tx)"}}>{w.title}</div>
              <div style={{fontSize:13,color:"#94a3b8",lineHeight:1.7}}>{w.content}</div>
            </div>)}
          </div>
        </>}

        <div className="sh">⚖️ <span>正負能量對比</span></div>
        <div style={{display:"flex",gap:8,marginBottom:6}}>
          {[["var(--c)","rgba(0,212,255,.07)","rgba(0,212,255,.2)",totalBlocked,"負面阻斷"],["var(--gd)","rgba(245,158,11,.07)","rgba(245,158,11,.2)",app.assets.length,"正面資產"]].map(([tc,bg,bc,n,lb])=>(
            <div key={lb} style={{flex:1,background:bg,border:`1px solid ${bc}`,borderRadius:10,padding:"8px",textAlign:"center"}}>
              <div style={{fontSize:22,fontWeight:700,fontFamily:"monospace",color:tc}}>{n}</div>
              <div style={{fontSize:10,color:"var(--mt)",marginTop:1}}>{lb}</div>
            </div>
          ))}
        </div>
        <div style={{height:6,background:"rgba(255,255,255,.07)",borderRadius:4,overflow:"hidden"}}>
          <div style={{width:`${Math.min(totalBlocked/(totalBlocked+app.assets.length||1)*100,100)}%`,height:"100%",background:"var(--c)",borderRadius:4,transition:"width .6s"}}/>
        </div>
        <p style={{fontSize:10,color:"var(--mt)",textAlign:"center",marginTop:4}}>目標：正面資產累積 ≥ 阻斷次數</p>
      </div>}

      {assetForm&&<AssetForm init={assetForm==="new"?null:assetForm} onSave={saveAsset} onClose={()=>setAssetForm(null)}/>}
    </div>
  </>;
}

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#080d14;--sur:#0d1520;--sur2:#121d2e;--bd:#1e2d42;--tx:#e2e8f0;--mt:#64748b;--c:#00d4ff;--p:#a78bfa;--gr:#34d399;--gd:#f59e0b;--g:#f59e0b;--font:'Noto Sans TC',sans-serif;--mono:'DM Mono',monospace}
body{background:var(--bg);font-family:var(--font);color:var(--tx);min-height:100vh;min-height:100dvh;overscroll-behavior:none}
.app{max-width:480px;margin:0 auto;min-height:100vh;min-height:100dvh;background:var(--bg);padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}
header{padding:12px 14px;padding-top:max(12px,env(safe-area-inset-top));display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--bd);position:sticky;top:0;z-index:10;background:var(--bg)}
.sp{background:var(--sur2);border:1px solid var(--bd);border-radius:9px;padding:4px 9px;text-align:center}
.gold{border-color:rgba(245,158,11,.3);background:rgba(245,158,11,.07)}
.sn{display:block;font-size:16px;font-weight:700;font-family:monospace;line-height:1}
.sl{font-size:9px;color:var(--mt)}
nav{display:flex;border-bottom:1px solid var(--bd);background:var(--sur);position:sticky;top:calc(44px + env(safe-area-inset-top));z-index:9}
.nb{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;padding:7px 2px;background:none;border:none;cursor:pointer;color:var(--mt);font-family:var(--font);font-size:10px;transition:color .2s;position:relative}
.nb:hover{color:var(--tx)}.nb.on{color:var(--c)}
.nb.on::after{content:'';position:absolute;bottom:0;width:22px;height:2px;background:var(--c);border-radius:2px}
.panel{padding:13px;min-height:calc(100vh - 100px)}
.sh{display:flex;gap:7px;align-items:center;margin-bottom:8px;font-size:13px;font-weight:700}
.tg{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:4px}
.tb{background:var(--sur);border:1px solid var(--bd);border-radius:11px;padding:9px;cursor:pointer;display:flex;align-items:center;gap:7px;transition:all .15s;font-family:var(--font);text-align:left}
.tb:hover{border-color:var(--c);background:rgba(0,212,255,.06)}.tb:active{transform:scale(.97)}
.ri{display:flex;align-items:center;gap:9px;background:var(--sur);border:1px solid var(--bd);border-radius:9px;padding:8px 11px;margin-bottom:5px}
.badge{font-size:10px;color:var(--mt);background:rgba(255,255,255,.05);border-radius:4px;padding:2px 5px;white-space:nowrap}
.badge.g{color:var(--gr);background:rgba(52,211,153,.1)}
.sos-ring{width:150px;height:150px;border-radius:50%;border:2px solid rgba(0,212,255,.2);display:flex;align-items:center;justify-content:center;animation:rp 3s ease-in-out infinite}
@keyframes rp{0%,100%{box-shadow:0 0 30px rgba(0,212,255,.06)}50%{box-shadow:0 0 50px rgba(0,212,255,.14)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.sos-btn{width:120px;height:120px;border-radius:50%;background:radial-gradient(circle at 40% 35%,rgba(0,212,255,.2),rgba(0,212,255,.06));border:2px solid rgba(0,212,255,.5);cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px}
.sc{background:var(--sur);border:1px solid var(--bd);border-radius:13px;padding:15px;display:flex;flex-direction:column;gap:11px;animation:su .3s ease-out}
@keyframes su{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.tb-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.05);border:1px solid var(--bd);border-radius:20px;padding:3px 10px;font-size:12px;align-self:flex-start}
.fl{font-size:10px;color:var(--mt);margin-bottom:5px}
.chip{background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.35);border-radius:20px;padding:6px 12px;font-size:13px;color:#c4b5fd;cursor:pointer;font-family:var(--font);transition:all .15s;font-weight:500}
.chip.on{background:rgba(167,139,250,.3);border-color:rgba(167,139,250,.8);color:#fff;font-weight:700;box-shadow:0 0 10px rgba(167,139,250,.3)}
.sb2{background:rgba(255,255,255,.03);border:1px solid;border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:7px}
.eb{background:rgba(255,255,255,.05);border:1px solid var(--bd);border-radius:7px;padding:5px 10px;color:var(--tx);font-size:11px;cursor:pointer;font-family:var(--font);align-self:flex-start}
.nb2{padding:11px;border:none;border-radius:11px;color:#080d14;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font)}
.sb{padding:10px 13px;border:1px solid var(--bd);border-radius:11px;background:var(--sur2);color:var(--tx);font-size:12px;cursor:pointer;font-family:var(--font)}
.star-btn{background:none;border:none;cursor:pointer;font-size:22px;color:rgba(255,255,255,.15);transition:color .15s;padding:0}
.star-btn.lit{color:var(--gd)}
.rw{background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.3);border-radius:20px;padding:5px 14px;font-size:12px;color:var(--gr)}
.gb{flex:1;padding:10px;border:none;border-radius:11px;background:var(--gd);color:#080d14;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font)}
.sbar{display:flex;align-items:center;gap:7px;background:rgba(255,255,255,.04);border:1px solid var(--bd);border-radius:9px;padding:7px 11px;margin-bottom:9px}
.sbar input{flex:1;background:none;border:none;color:var(--tx);font-family:var(--font);font-size:12px;outline:none}
.sbar input::placeholder{color:var(--mt)}
.fs{display:flex;gap:5px;overflow-x:auto;padding-bottom:8px;margin-bottom:9px}
.fs::-webkit-scrollbar{display:none}
.fp{flex-shrink:0;background:rgba(255,255,255,.04);border:1px solid var(--bd);border-radius:20px;padding:3px 9px;font-size:10px;color:var(--mt);cursor:pointer;font-family:var(--font);white-space:nowrap;transition:all .15s}
.fp.on{background:rgba(167,139,250,.12);border-color:rgba(167,139,250,.4);color:var(--p)}
.wc1{background:var(--sur);border:1px solid var(--bd);border-radius:11px;padding:11px;cursor:default;transition:border-color .15s}
.wc1.on{border-color:rgba(167,139,250,.5);background:rgba(167,139,250,.06)}
.wc1:hover{border-color:rgba(167,139,250,.3)}
.wc2{background:var(--sur2);border:1px solid var(--bd);border-radius:9px;padding:7px;cursor:pointer;display:flex;flex-direction:column;gap:2px;width:90px;flex-shrink:0;text-align:left;transition:all .15s;font-family:var(--font);color:var(--tx)}
.wc2:hover,.wc2.on{border-color:rgba(167,139,250,.5);background:rgba(167,139,250,.08)}
.wc2 .wc-cat{font-size:9px;color:var(--mt);line-height:1.3}
.wc2 .wc-title{font-size:11px;color:var(--tx);font-weight:600;line-height:1.3}
.wc2 .wc-star{font-size:10px;color:var(--g)}
.cat-badge{font-size:9px;color:var(--p);background:rgba(167,139,250,.1);border-radius:4px;padding:1px 5px;white-space:nowrap;flex-shrink:0}
.pw{padding:9px;border:1px solid rgba(167,139,250,.4);border-radius:9px;background:rgba(167,139,250,.1);color:var(--p);font-size:12px;font-weight:600;cursor:pointer;font-family:var(--font)}
.add-a{width:100%;padding:11px;border:2px dashed rgba(245,158,11,.3);border-radius:11px;background:rgba(245,158,11,.06);color:var(--gd);font-size:13px;font-weight:600;cursor:pointer;font-family:var(--font);margin-bottom:11px;transition:all .15s}
.ac{background:var(--sur);border:1px solid var(--bd);border-radius:11px;padding:11px;margin-bottom:7px}
.xb{background:none;border:none;color:var(--mt);cursor:pointer;font-size:13px;padding:2px 5px;border-radius:4px;line-height:1}
.xb:hover{color:var(--tx)}.xb.red:hover{color:#f87171}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:flex-end;justify-content:center;z-index:100}
.modal{background:var(--sur);border:1px solid var(--bd);border-radius:18px 18px 0 0;padding:18px 18px 28px;width:100%;max-width:480px;display:flex;flex-direction:column;gap:10px;animation:su2 .25s ease-out}
@keyframes su2{from{transform:translateY(50px);opacity:0}to{transform:translateY(0);opacity:1}}
.modal-h{font-size:16px;font-weight:700;margin-bottom:2px}
.ff{display:flex;flex-direction:column;gap:4px}
.ff label{font-size:10px;color:var(--mt)}
.fi{background:rgba(255,255,255,.04);border:1px solid var(--bd);border-radius:8px;padding:9px 11px;color:var(--tx);font-family:var(--font);font-size:12px;outline:none;width:100%}
.fi:focus{border-color:var(--gd)}.fi::placeholder{color:var(--mt)}
.dd-btn{background:rgba(255,255,255,.04);border:1px solid var(--bd);border-radius:8px;padding:9px 11px;color:var(--tx);font-family:var(--font);font-size:12px;cursor:pointer;display:flex;align-items:center;gap:6px;width:100%}
.dd-list{background:var(--sur2);border:1px solid var(--bd);border-radius:9px;overflow:hidden;max-height:190px;overflow-y:auto}
.ddi{width:100%;display:flex;align-items:center;gap:7px;padding:8px 11px;background:none;border:none;color:var(--tx);font-family:var(--font);font-size:12px;cursor:pointer;transition:background .15s;text-align:left}
.ddi:hover{background:rgba(255,255,255,.05)}.ddi.s{background:rgba(245,158,11,.1);color:var(--gd)}
`;
