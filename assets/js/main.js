/* =========================================================
   마음 키오스크 — 공통 스크립트
   ========================================================= */
(function () {
  "use strict";

  var CFG = window.HK_CONFIG || {};

  /* ---------- 1. 헤더 / 모바일 메뉴 ---------- */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    if (nav) {
      nav.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
          header.classList.remove("nav-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }
  }

  /* ---------- 2. 카카오톡 / 이메일 링크 주입 ---------- */
  document.querySelectorAll("[data-kakao]").forEach(function (el) {
    el.setAttribute("href", CFG.kakaoChannel || "https://pf.kakao.com/_dFvxbG");
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
  document.querySelectorAll("[data-email]").forEach(function (el) {
    var mail = CFG.email || "heartkioskofficial@gmail.com";
    el.setAttribute("href", "mailto:" + mail);
    if (el.dataset.email === "text") el.textContent = mail;
  });
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- 3. 스크롤 등장 효과 ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    if ("IntersectionObserver" in window &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.07 });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add("is-in"); });
    }
  }

  /* ---------- 4. 유튜브 영상 (클릭 시에만 로드) ---------- */
  var videoFrame = document.querySelector("[data-video]");
  if (videoFrame) {
    var playBtn = videoFrame.querySelector(".video-play");
    if (playBtn) {
      playBtn.addEventListener("click", function () {
        var id = CFG.youtubeId || "QH8jgQp7Ydk";
        var iframe = document.createElement("iframe");
        iframe.src = "https://www.youtube-nocookie.com/embed/" + id +
          "?autoplay=1&rel=0&modestbranding=1";
        iframe.title = "마음 키오스크 사용 영상";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        videoFrame.innerHTML = "";
        videoFrame.appendChild(iframe);
      });
    }
  }

  /* ---------- 5. 예약 폼 ---------- */
  var form = document.getElementById("reserve-form");
  if (!form) return;

  var msgBox = document.querySelector(".form-msg");
  var result = document.getElementById("reserve-result");
  var summaryEl = document.getElementById("reserve-summary");
  var mailBtn = document.getElementById("result-mail");
  var copyBtn = document.getElementById("result-copy");
  var copyDone = document.querySelector(".copy-done");

  function showMsg(text, kind) {
    if (!msgBox) return;
    msgBox.className = "form-msg " + (kind === "ok" ? "is-ok" : "is-error");
    msgBox.textContent = text;
  }

  function val(name) {
    var el = form.elements[name];
    if (!el) return "";
    return (el.value || "").trim();
  }

  function optionText() {
    var picked = form.querySelector('input[name="option"]:checked');
    return picked ? picked.dataset.label : "";
  }

  function prettyDate(v) {
    if (!v) return "";
    var p = v.split("-");
    if (p.length !== 3) return v;
    return p[0] + "년 " + Number(p[1]) + "월 " + Number(p[2]) + "일";
  }

  function buildSummary() {
    var lines = [];
    lines.push("[마음 키오스크 예약 신청]");
    lines.push("· 예식일: " + prettyDate(val("weddingDate")) + (val("weddingTime") ? " " + val("weddingTime") : ""));
    lines.push("· 예식장: " + val("venue"));
    if (val("venueAddress")) lines.push("· 예식장 주소: " + val("venueAddress"));
    lines.push("· 신랑: " + val("groom"));
    lines.push("· 신부: " + val("bride"));
    lines.push("· 연락처: " + val("phone"));
    if (val("email")) lines.push("· 이메일: " + val("email"));
    lines.push("· 신청 옵션: " + optionText());
    if (val("referrer")) lines.push("· 짝꿍 이벤트 추천인: " + val("referrer"));
    if (val("memo")) lines.push("· 문의 내용: " + val("memo"));
    lines.push("");
    lines.push("보낸 곳: heartkiosk.com 예약 페이지");
    return lines.join("\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      var firstBad = form.querySelector(":invalid");
      showMsg("입력하지 않았거나 형식이 맞지 않는 항목이 있어요. 표시된 곳을 확인해 주세요.", "error");
      if (firstBad) {
        firstBad.focus();
        firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    if (!form.querySelector('input[name="option"]:checked')) {
      showMsg("희망하시는 옵션을 하나 선택해 주세요.", "error");
      document.querySelector(".opt-group").scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    var text = buildSummary();
    var subject = "[예약 신청] " + prettyDate(val("weddingDate")) + " " + val("venue") + " / " + optionText();

    /* 자동 접수 엔드포인트가 설정되어 있으면 그쪽으로 전송 */
    if (CFG.reserveEndpoint) {
      showMsg("신청서를 보내는 중입니다…", "ok");
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      /* Google Apps Script 웹앱은 OPTIONS 사전 요청에 응답하지 않아
         application/json 으로 보내면 브라우저가 막습니다.
         text/plain 은 사전 요청이 없는 '단순 요청'이라 그대로 전달되고,
         서버(Apps Script)는 본문을 JSON 으로 읽습니다. */
      fetch(CFG.reserveEndpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          submittedAt: new Date().toISOString(),
          weddingDate: val("weddingDate"),
          weddingTime: val("weddingTime"),
          venue: val("venue"),
          venueAddress: val("venueAddress"),
          groom: val("groom"),
          bride: val("bride"),
          phone: val("phone"),
          email: val("email"),
          option: optionText(),
          referrer: val("referrer"),
          memo: val("memo"),
          source: "heartkiosk.com"
        }),
        redirect: "follow"
      }).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text();
      }).then(function (body) {
        var data = null;
        try { data = JSON.parse(body); } catch (e) { data = null; }
        /* Apps Script 가 {ok:true} 를 돌려줄 때만 접수 성공으로 본다.
           (권한 설정이 틀리면 로그인 페이지가 200 으로 와서 성공처럼 보일 수 있음) */
        if (!data || data.ok !== true) throw new Error("unexpected response");
        if (submitBtn) submitBtn.disabled = false;
        showMsg("신청이 접수되었습니다. 확인 후 연락드릴게요.", "ok");
        openResult(text, subject, false);
      }).catch(function () {
        if (submitBtn) submitBtn.disabled = false;
        showMsg("자동 접수에 실패했습니다. 아래 '메일로 보내기' 또는 카카오톡으로 보내주세요.", "error");
        openResult(text, subject, true);
      });
      return;
    }

    openResult(text, subject, true);
  });

  function openResult(text, subject, needSend) {
    if (!result) return;
    if (summaryEl) summaryEl.textContent = text;
    if (mailBtn) {
      mailBtn.href = "mailto:" + (CFG.email || "heartkioskofficial@gmail.com") +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(text);
      mailBtn.style.display = needSend ? "" : "none";
    }
    if (copyBtn) copyBtn.style.display = needSend ? "" : "none";
    var firstStep = result.querySelector(".steps li");
    if (firstStep) {
      firstStep.innerHTML = needSend
        ? "아래 내용을 확인한 뒤 <strong>‘메일로 보내기’</strong>를 눌러 주세요. 메일 앱이 열리면 그대로 전송하시면 됩니다."
        : "신청서가 <strong>자동으로 접수</strong>되었습니다. 담당자가 확인한 뒤 연락드립니다.";
    }
    result.classList.add("is-open");
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var text = summaryEl ? summaryEl.textContent : "";
      function done() {
        if (copyDone) copyDone.classList.add("is-on");
        setTimeout(function () { if (copyDone) copyDone.classList.remove("is-on"); }, 2600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else { fallback(); }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (e) { /* noop */ }
        document.body.removeChild(ta);
      }
    });
  }

  /* 날짜 최소값: 오늘 */
  var dateInput = form.elements["weddingDate"];
  if (dateInput) {
    var t = new Date();
    var iso = t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");
    dateInput.min = iso;
  }

  /* 옵션 선택 시 안내 문구 갱신 (선택) */
  form.querySelectorAll('input[name="option"]').forEach(function (r) {
    r.addEventListener("change", function () { if (msgBox) msgBox.className = "form-msg"; });
  });
})();
