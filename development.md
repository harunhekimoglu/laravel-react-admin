Gorev yonetimi gelistirmesi icin;

Task model ve migration olusturuldu.
user_id => gorevi yapacak kisi icin foreign key
status => gorevin durumu icin enum (todo | in-progress | done)
title => gorevin basligi icin string
description => gorevin aciklamasi icin text

API endpointleri icin routes hazirlandi.

API endpointleri icin controllers hazirlandi.
Kanban boardda todo, in progress ve done icin gruplanarak data donusu hazirlandi.
Yeni kayit yapildiginda bi sonraki pazartesi gorev in progress e alinacak job hazirlandi.
Dragdrop ve edit icin update hazirlandi.

Kullanicilari [id => name] donecek sekilde API endpoint ve controller (with cache) hazirlandi.

Datayi frontta istek atip alacak services hazirlandi.

Front router ve sidebar guncellendi.

Front crud ve kanban board sayfalari hazirlandi.
