export type Product = {
  name: string;
  link: string;
  images: string[];
};

export type ProductGroup = Record<string, Product[]>;

export const catalog: Record<string, ProductGroup> = {
  walnut: {
    "Coffee Tables": [
      { name: '55" Rectangular Walnut Grain Coffee Table', link: "https://amzn.to/4eJxApr", images: ["https://lh3.googleusercontent.com/d/1Kp4bHkvpvAfnAHaLp_rFGcn2R6qxFdNM", "https://lh3.googleusercontent.com/d/1HWnGDPA9rkcaeixOovCMY5H-baiee2m7"] },
      { name: "Henn&Hart Rectangular Pedestal Coffee Table in Satin Walnut", link: "https://amzn.to/4oN1r4S", images: ["https://lh3.googleusercontent.com/d/1E1i8RXXSmo1w2fBUndFnbiNRBt1cWfsK", "https://lh3.googleusercontent.com/d/1outd4B9X6aPEeEOXro1VdH7nUz5A_yci"] },
      { name: "IBF Walnut Coffee Table with Black Metal Legs", link: "https://amzn.to/4vwuHPL", images: ["https://lh3.googleusercontent.com/d/1H-HwjmemXBifjg1ssHxOx9NHr6B90VFV", "https://lh3.googleusercontent.com/d/1_TxoxKkwTuYYtPr3gBqv3doCMbYXXK9x"] },
      { name: "Sculptural Coffee Table", link: "https://amzn.to/4vtBfyN", images: ["https://lh3.googleusercontent.com/d/1LS0XiFv8tlPU4vuwOHwBE-qwtUAy1CFT", "https://i.pinimg.com/736x/65/ca/65/65ca65543e3e9023014e2dd98882f77f.jpg"] },
      { name: "Solid Wood Rectangular Coffee Table", link: "https://amzn.to/4w6QWf3", images: ["https://lh3.googleusercontent.com/d/1neBecqChJAvLnYm4i-nd5KFHFeHrUWpv", "https://lh3.googleusercontent.com/d/1Utf-Ok9A7b2uKbGKjpC-av71l_QHf6Tu"] },
      { name: "2-Tier Tempered Glass Top Coffee Table", link: "https://amzn.to/4eMy0ex", images: ["https://lh3.googleusercontent.com/d/1QE6yNrBgQa1Zzl5Ic4OXEKZAO7pzOGGY", "https://lh3.googleusercontent.com/d/1T2CmWOwI2TaAgvNlIednSD0DdcPHVYjd"] },
      { name: "Mid Century Modern Triangle Coffee Table", link: "https://amzn.to/442sT57", images: ["https://lh3.googleusercontent.com/d/1ukPgX8EE6wOkgNr5Wbuh3L3pfuGTtd26", "https://lh3.googleusercontent.com/d/1DYZ5WEzvqlD7B8m-cqbAfG-G_1Y_YX00", "https://lh3.googleusercontent.com/d/18gf5NZGtm3LKxvW7NR0VfYl9nfeC2FDD"] },
      { name: "Solid Wood Coffee Table with Cross Base Legs", link: "https://amzn.to/4ggCZXz", images: ["https://lh3.googleusercontent.com/d/1259F7gprZXUR_3ybN_qVcQ1UqrsBX0hM", "https://lh3.googleusercontent.com/d/1BjBcdu5TR5x-elD59lD1-o7_JGdI1690", "https://lh3.googleusercontent.com/d/1wmqV4ioalHuJPcklss4EvLLIOEYVgxSI"] },
    ],
    "Side Tables": [
      { name: "Sculptural Hourglass Side Table", link: "https://amzn.to/3QLccIq", images: ["https://i.pinimg.com/736x/d6/92/6f/d6926f954cf165c7414b94eb6dd51d1d.jpg", "https://i.pinimg.com/736x/e2/b9/1e/e2b91e17afeec767489d103d322c4da3.jpg"] },
      { name: "Martini Side Table", link: "https://www.amazon.com/dp/B0DJQD8SH4?tag=theinterio044-20", images: ["https://lh3.googleusercontent.com/d/1POvINt-JE5lpKhOlVac4t0bjKW8PCYsg", "https://lh3.googleusercontent.com/d/1_nb76JIv0pKmIYqgK6E5TrkyHLcphHTG", "https://lh3.googleusercontent.com/d/1rh8VkQsx2EQpfIfW3-unBzKmoJLivusF"] },
      { name: "Walnut Rolling Side Table", link: "https://amzn.to/4gHMdMv", images: ["https://lh3.googleusercontent.com/d/1Hk7UkBTY2EM8TnKkfeXjzqRtaXZ-FX9m", "https://lh3.googleusercontent.com/d/10WKCoieAJRqwPTHa5ml6X_5RPDxogfOz"] },
      { name: "Walnut Nesting Side Tables", link: "https://amzn.to/4eQpHyF", images: ["https://lh3.googleusercontent.com/d/1APeTdchpLBalmJ_CR-md1NibOLzVypQz"] },
      { name: "Hexagonal Side Table", link: "https://amzn.to/4eQDgOB", images: ["https://lh3.googleusercontent.com/d/1uQDuAhbIzBckv1SQAbtS2lYeMBGs0JPG"] },
      { name: "Bergamot Pedestal", link: "https://amzn.to/4v9naWs", images: ["https://lh3.googleusercontent.com/d/13Ad_5S511fpVFZfbTPaNxtO1xwv4yXR1", "https://lh3.googleusercontent.com/d/1_iu0fj7UfjB-kC6rcgXTdItV9JycHWQC"] },
      { name: "Spiral Side Table", link: "https://amzn.to/4oUThro", images: ["https://lh3.googleusercontent.com/d/17wKqbSRV0wuqFNNohvXQzyY4vF0ZOBZ9", "https://lh3.googleusercontent.com/d/1Y80A7FE_r4HH7fCoGTRifmSK7EBef1Xu"] },
      { name: "Creative Co-Op Paulownia Wood Round Table", link: "https://amzn.to/4v1hrSn", images: ["https://lh3.googleusercontent.com/d/1v6LXPmMZcFYgGo7Z5yuzxpEzWLBQc6tU", "https://lh3.googleusercontent.com/d/1plfpdLch9VqOn7vRLRcjV3SmQ_oNanIc"] },
    ],
    Seating: [
      { name: "Mid Century Modern Walnut Rattan Chair", link: "https://amzn.to/3SxiBYf", images: ["https://lh3.googleusercontent.com/d/1B6L-Mp0PrBAmFOzoKb6obvhfAbVgYFzC"] },
      { name: "Wooden Frame Accent Chair", link: "https://amzn.to/4aml6mn", images: ["https://lh3.googleusercontent.com/d/19AidPGHUCM9R3T2GuYToX0CuxNmLXcDO", "https://lh3.googleusercontent.com/d/1zTA_pKFJ_hblEsIHgYGd9XlPHZQlXaya", "https://lh3.googleusercontent.com/d/1NCW0aeLXxFjk-R02u06s3-r3CRn07FHN"] },
    ],
  },
  walnutDining: {
    "Dining Chairs": [
      { name: "Mid Century Modern Faux Leather Chair", link: "https://amzn.to/4eQrpRT", images: ["https://lh3.googleusercontent.com/d/1d0QtGv-f3AafZHZ7rgU5EjvDWDDrD1QE", "https://lh3.googleusercontent.com/d/1xiyFttVyWUt9S1L_p_FEIPzRFOlBYt13", "https://lh3.googleusercontent.com/d/13rxRKlj6gpktk1oMCBGC_Mt8Yx7naNA9"] },
      { name: "Mid Century Modern Armless Faux Leather Chair", link: "https://amzn.to/445a5Cr", images: ["https://lh3.googleusercontent.com/d/1sMz9LmAkM2aVXxLiY9fXlpIMkjnCMGbu", "https://lh3.googleusercontent.com/d/1T4CIP1ughS-LN3ucUptwYI3qmZJNRrSM", "https://lh3.googleusercontent.com/d/1BiN8L0NxOku2rezirzzI6dREF6ZvgvTz"] },
      { name: "Mid Century Modern Armless Linen Chair", link: "https://amzn.to/3Rj7MbX", images: ["https://lh3.googleusercontent.com/d/1RJDU8dvlqXjEc0p68kRBBSc8s7Vf1-DM", "https://lh3.googleusercontent.com/d/1KAjxzsN_qRP93mdRc0uoCDjMCk5mAVL7", "https://lh3.googleusercontent.com/d/1Eh4TzbHjubfkG_-mt3TERtnT8A6H9Ntt", "https://lh3.googleusercontent.com/d/1z3R40gRq_MFG9AfCL4akeg8yrku8Tz4O"] },
      { name: "Stackable Stool", link: "https://amzn.to/4gXIRoC", images: ["https://lh3.googleusercontent.com/d/1YbC_4250OcjzqLEW_4lo3KJqRXskPPya"] },
      { name: "Solid Wood Dining Chair", link: "https://www.amazon.com/dp/B0CZD5W1KP?tag=theinterio044-20", images: ["https://lh3.googleusercontent.com/d/1WlM7-OBYr54Bdf1zLmy4wn0Vq0DgNJBS", "https://lh3.googleusercontent.com/d/1QMMSiFzGG9PVNteK5ZfUECVoMD27E_Uk"] },
    ],
    "Dining Tables": [
      { name: "X Pedestal Dining Table", link: "https://amzn.to/4feyqvD", images: ["https://lh3.googleusercontent.com/d/1Yll6uQyPBR7YdzfX-0HS-adefwP87mgS", "https://lh3.googleusercontent.com/d/1hzqUFzPkGtNjgmYYDGKvuA9ZF4C8UeLc", "https://lh3.googleusercontent.com/d/1NNjtPq-7qv3b56utx0r8xWZhOCWBAkcb", "https://lh3.googleusercontent.com/d/1iSUiEayirvsXFX63ycD-iZ6i3oHR0Bm1"] },
      { name: "Cone Pedestal Dining Table", link: "https://amzn.to/4gBvsTp", images: ["https://lh3.googleusercontent.com/d/1ZxKw5kVeexVG-lAUtDe4P5hkcKPNgSkR", "https://lh3.googleusercontent.com/d/1rKk4XLbnZLV6qmVNBFfKWhV-7Wno_kGm", "https://lh3.googleusercontent.com/d/1RDTo6Tbokr40m2nvHQKzhL19Bhl5uX9P"] },
      { name: "Herringbone Dining Table", link: "https://amzn.to/3QOqmZq", images: ["https://lh3.googleusercontent.com/d/1qbacv_852TfejOKfPT9kTOdo6qkqLn9P", "https://lh3.googleusercontent.com/d/1qvyUlbpU10aGabzrCpSuQUnQ8UJrikAu"] },
    ],
  },
  oak: {
    "Coffee Tables": [
      { name: '55" Farmhouse Coffee Table', link: "https://amzn.to/4vHSaxG", images: ["https://lh3.googleusercontent.com/d/1Xkfg_Mqg1BKLriBKJar94GALGJaRXT3I", "https://lh3.googleusercontent.com/d/1BcO-AevEEl2VaTDxn2Y5eHF6PED9yE8v"] },
      { name: "Pedestal Coffee Table", link: "https://amzn.to/4oRSIOS", images: ["https://lh3.googleusercontent.com/d/1y9k3PncLyAgv0sQdn7QYJGo8p0BivrNa", "https://lh3.googleusercontent.com/d/1L1Jxbj2nHjEfqerQBMy8FBT3c6eN7Y-f", "https://lh3.googleusercontent.com/d/1gC9hSBGsBmyYtpXiTiOBZt6NT312KKv4"] },
      { name: "Oval Coffee Table", link: "https://amzn.to/4eFUn5i", images: ["https://lh3.googleusercontent.com/d/1eL7PRlM-UsykHY1GSjlH1xtOaqtvAv8a", "https://lh3.googleusercontent.com/d/1PqV0EiklkbxEqCTrJZUnp2Kq0zX2m-w8", "https://lh3.googleusercontent.com/d/1xaNbDt3rpJogGcOLDRnBpA0FasSVFd3h"] },
      { name: "Solid Wood Coffee Table", link: "https://amzn.to/4wskNyZ", images: ["https://lh3.googleusercontent.com/d/1Xmk1kTw2i-QiqIOZB_cFUXVeTqIArh-A", "https://lh3.googleusercontent.com/d/1l4AhgX5oNEvMhAYwIh6h3_YFEurQ9GuK", "https://lh3.googleusercontent.com/d/13rsMFLanPTu0QEgzTyj4OlsLsjQXcK5U"] },
    ],
    "Side Tables": [
      { name: "Cube Side Table", link: "https://amzn.to/4vN32KH", images: ["https://lh3.googleusercontent.com/d/1Ylv8GefFhyToINWn9B9gIP2RbFFfjOBD", "https://lh3.googleusercontent.com/d/1EkAJfBuhuzOldM-36zDaqj2Z8XMW9eIk", "https://lh3.googleusercontent.com/d/19Ra6GaTd1NzRMvCHAh6fzGlIw4Y2Xvue"] },
      { name: "Rectangular Side Table", link: "https://amzn.to/4y0eeW0", images: ["https://lh3.googleusercontent.com/d/1WsTqcNvEpKDz3dthXX44Kir7DQOw7aTN", "https://lh3.googleusercontent.com/d/1kcixtdNMvKoV18Ho1O9xn93MmMRidyRa", "https://lh3.googleusercontent.com/d/1cAoJjxfHTb0_fWAnXREkwQt9_wuFuwvE"] },
      { name: "Stackable Cube Side Table", link: "https://amzn.to/3Swh6tq", images: ["https://lh3.googleusercontent.com/d/1dpVaVCNJIMZps1YVQVALA43m4bZXhhsh", "https://lh3.googleusercontent.com/d/1hhjPAktzU2BOhFdOwvBemNLVQ2FlO02x"] },
      { name: "Transitional Wooden Side Table", link: "https://amzn.to/4wkWGSD", images: ["https://lh3.googleusercontent.com/d/1UWr4D-2d7Cx63LKoN-P3DnQiT_XH7CiH", "https://lh3.googleusercontent.com/d/12iCimxvUqVocBbJ3Rqr9tHme7zYIusD0", "https://lh3.googleusercontent.com/d/1msc044EN3xJokOJLYXQsGIh8Ro2nUZL1"] },
      { name: "C-Shaped Side Table", link: "https://amzn.to/4wnKkct", images: ["https://lh3.googleusercontent.com/d/1s4C09mIbLATD26PokqCwzzbMRoYdhYX1", "https://lh3.googleusercontent.com/d/1oq5WpDxqJgYhXXFtvT-0n9ftrg6gWixq", "https://lh3.googleusercontent.com/d/1ioz7fbj7q6ShJX8QFbW-XIe3iDe89umm"] },
    ],
    Seating: [
      { name: "Cesca Cane Chairs", link: "https://amzn.to/4vVlIbr", images: ["https://lh3.googleusercontent.com/d/1DAW2TpX4LHUZQTXYQDCDnoCvUVTSumoz", "https://lh3.googleusercontent.com/d/1VUqbU6CZ9-dUT0Riz8V29CBdBjTPhOSK", "https://lh3.googleusercontent.com/d/1d3G040OM15wWGVTS7sScSqiiXaR0zTRS"] },
      { name: "Midcentury Rattan Accent Chair", link: "https://amzn.to/3Sq9ZTn", images: ["https://lh3.googleusercontent.com/d/1ftLOOx08Dz6l67uUsmYMEB9P87ZtNTdG", "https://lh3.googleusercontent.com/d/18sajMglq3iYHfdp2hMu_8X_BOuTyy_s2", "https://lh3.googleusercontent.com/d/1SIobPKGQkPTcMTWBeY92I3cJASsssYEM"] },
      { name: "Minimal Stackable Stool", link: "https://amzn.to/4vCrBtB", images: ["https://lh3.googleusercontent.com/d/11AsC7Zj8K3oHt8G32_av_Pge8-kmQU57", "https://lh3.googleusercontent.com/d/1tYGE5IZwAvtOE2nKzsNjZSC9uLXMmRaI"] },
      { name: "Mid Century Modern Armchair", link: "https://amzn.to/3SVf0mU", images: ["https://lh3.googleusercontent.com/d/1ZcEmB9nW7Tyez3B3z989Aq30iLf52cxH", "https://lh3.googleusercontent.com/d/1p_zLDRRM_nV5SEYQMV9YEDTQUVm88Gwm", "https://lh3.googleusercontent.com/d/1CLBZysAFo9Bw7ZPBeeiTX8r9aCjbiA8u"] },
    ],
  },
  oakDining: {
    "Dining Chairs": [
      { name: "Cesca Cane Chairs", link: "https://amzn.to/4vVlIbr", images: ["https://lh3.googleusercontent.com/d/1DAW2TpX4LHUZQTXYQDCDnoCvUVTSumoz", "https://lh3.googleusercontent.com/d/1VUqbU6CZ9-dUT0Riz8V29CBdBjTPhOSK", "https://lh3.googleusercontent.com/d/1d3G040OM15wWGVTS7sScSqiiXaR0zTRS"] },
      { name: "Farmhouse Rattan Dining Chair", link: "https://amzn.to/3QREq4j", images: ["https://lh3.googleusercontent.com/d/1n-vEW7iVQRaipfQlj-B2DCJGGeCM8arj", "https://lh3.googleusercontent.com/d/1aAZTw5VIjcw00z8pZ5Gh2gLKmsmkK2r7", "https://lh3.googleusercontent.com/d/1aoGAwrPdYqzXmRWgWOdfYLs0BJredJUZ", "https://lh3.googleusercontent.com/d/1ihCcq6FMIxhnPz3prOMCRs35KX6Wo6gB"] },
      { name: "Solid Beechwood Mid-Century Dining Chairs", link: "https://amzn.to/4aVgtzO", images: ["https://lh3.googleusercontent.com/d/1_qU8PYTJCWPAcN2vIIfOeIf3WRsv4kVZ", "https://lh3.googleusercontent.com/d/1ICFn6QOACtMVeWOrDuDFzyucO-DyKgII", "https://lh3.googleusercontent.com/d/1K0DCDfC7gLELzhW6r7w0qe1S1iF-0mvu"] },
      { name: "Curved Dining Chairs", link: "https://amzn.to/3T99LA1", images: ["https://lh3.googleusercontent.com/d/12Ty8Uij93Wl841QPPHxmKTKi2_Iro4ie", "https://lh3.googleusercontent.com/d/1ST0rx1LW_21iv4SUorQ_9vhO4bnV1nwL", "https://lh3.googleusercontent.com/d/1b4ZyRFBFJyDAzQQyH3H_bZMudGRM9oMm"] },
      { name: "Mid Century Modern Dining Chair", link: "https://amzn.to/4wefC5n", images: ["https://lh3.googleusercontent.com/d/12Nmac1wQHcPrUVNhFxOeNIPBASQTJt3T", "https://lh3.googleusercontent.com/d/1NNr6lcsU7wJUyIYZoQIBMxyMBibffasI", "https://lh3.googleusercontent.com/d/1G0Ipqvc8gTHK1YjeeAPD9MlcBA9nj0sM"] },
      { name: "Keiko White and Natural Cane Dining Chair", link: "https://amzn.to/4axsN9k", images: ["https://lh3.googleusercontent.com/d/1JfY8S5h-JZo5V5xJUWdi-L5XyBqA-XHf", "https://lh3.googleusercontent.com/d/1WPxtgMQZPC1V825V7Qmc8odn4w2chl7x", "https://lh3.googleusercontent.com/d/1egDzDrHd4ekTQ1BvTvjAFPqAkrgtntkA"] },
      { name: "Arched Rattan Dining Chairs", link: "https://amzn.to/4arIBum", images: ["https://lh3.googleusercontent.com/d/1ue19wrVRI_t3GAm4UYgJbi__GZVGamGn", "https://lh3.googleusercontent.com/d/1yBiUTsalk5daDHF5-BHBw2floygJEdQ6"] },
      { name: "Wishbone Chair", link: "https://amzn.to/4gzzTy3", images: ["https://lh3.googleusercontent.com/d/1wHyoDoK1bji6YvNp3aUdjKf7tsF5WBnp", "https://lh3.googleusercontent.com/d/1qbvnlQNM2TyR1hE66ejxR95lcaZJd9KD", "https://lh3.googleusercontent.com/d/1iUZUH3hWxeJvZP3Ex8UDS9c6rPra_PuK"] },
      { name: "Minimal Stackable Stool", link: "https://amzn.to/4vCrBtB", images: ["https://lh3.googleusercontent.com/d/11AsC7Zj8K3oHt8G32_av_Pge8-kmQU57", "https://lh3.googleusercontent.com/d/1tYGE5IZwAvtOE2nKzsNjZSC9uLXMmRaI"] },
      { name: "Slatted Dining Bench", link: "https://amzn.to/43Z1SQ9", images: ["https://lh3.googleusercontent.com/d/1IuDNAsviVPag2VPd1hiB93oQG5r8MHTK", "https://lh3.googleusercontent.com/d/1C_ijIbFX16o6wvPBMEl54SiuIRDquwPm"] },
      { name: "Slatted Dining Bench", link: "https://amzn.to/4eTHODE", images: ["https://lh3.googleusercontent.com/d/1-9ewIDl1Ra9CiNEP_tJTrEUbnGFeqbDf", "https://lh3.googleusercontent.com/d/1HM5UfXFmfJSY_HfaUPmg2StAcovyTEcB", "https://lh3.googleusercontent.com/d/1DAqoafJKyg0SrmDSKlWLZLOwPbuLnogv", "https://lh3.googleusercontent.com/d/1MI_1sSrKRfw-wzUdG9UVy-PUvXlNm-eT"] },
    ],
    "Dining Tables": [
      { name: "Cone Pedestal Dining Table", link: "https://amzn.to/4y2xEJS", images: ["https://lh3.googleusercontent.com/d/1dO_ml20hF_TJbS38cABjpnC5hFmiMRSy", "https://lh3.googleusercontent.com/d/1Dxg56KMc6whOHsrOTFbVqLU6L7I9XsEe", "https://lh3.googleusercontent.com/d/1OrKUflzLLXgaEK3GeCy1zZ1_gIz13jGK", "https://lh3.googleusercontent.com/d/1h6y7uDSJTy_lJ1fJfwsIX0nrlXwMmOsE", "https://lh3.googleusercontent.com/d/1Jkzr3vSiAD7j0NZmqFI6Kjjt7zGUc0Ii"] },
      { name: "Fluted Round Dining Table", link: "https://amzn.to/4faHWQy", images: ["https://lh3.googleusercontent.com/d/1RdBE3nXe6Lk2j6FZ6mq1wKhOg3jf6fJ_", "https://lh3.googleusercontent.com/d/1CmZXJJhMS9p5GibH-XBK30nUBo33hsiW", "https://lh3.googleusercontent.com/d/1DweL6QJHJ-whRft3d4t9kPju2vu_8J0Y"] },
      { name: "Herringbone Rectangular Dining Table", link: "https://amzn.to/4vPrtXV", images: ["https://lh3.googleusercontent.com/d/16zwApap6mWFm_GYXCdmWx9FDgJj7aylf", "https://lh3.googleusercontent.com/d/1PVda9KQXS0WtSlGTECmqZAZ3W03ilMo9", "https://lh3.googleusercontent.com/d/16yZLBjzB6BTfQP-yr4_QfswU1WSc1FAa"] },
      { name: '78" Fluted Dining Table', link: "https://amzn.to/4gQewZd", images: ["https://lh3.googleusercontent.com/d/14JiUwlxA7WeX8y4tFZhdZ7MPgLXjCgfa", "https://lh3.googleusercontent.com/d/1P79Pwd2Dm8cz12dJUaGtYC9ipcZjBy_H", "https://lh3.googleusercontent.com/d/18i86cFH0UEdFyDC5GXeuCLB-VCRcesM_"] },
      { name: '39" Solid Wood Dining Table', link: "https://www.amazon.com/dp/B0FDGM8KLD?tag=theinterio044-20", images: ["https://lh3.googleusercontent.com/d/1IUq9p8EShdnzvOBT7To0SX1H3h0D_zLc", "https://lh3.googleusercontent.com/d/1KlXh03HQm861q2Q8_LioNAHem4i_Kdcs", "https://lh3.googleusercontent.com/d/1pLWX_qpV2IBpDtsuaIlXW8VlqbgnrTT8"] },
    ],
  },
  light: {
    "Table Lamps": [
      { name: "Mushroom Lamp", link: "https://amzn.to/4oRZKTM", images: ["https://lh3.googleusercontent.com/d/1kN8Jmg_ayRcnGv7fxLydx4C6W0ZkL_nG", "https://lh3.googleusercontent.com/d/1betVRQKHa3_05d8TC805b-yhj-wQ9WPS", "https://lh3.googleusercontent.com/d/171-2QeOvc5QGQ9OehW3jNA9ZaD0B8Z_K"] },
      { name: "Oak Base Table Lamp", link: "https://amzn.to/4y0xwuk", images: ["https://lh3.googleusercontent.com/d/1hkLmbOZhhY0Z3DD5VqSU6_jivrYqtX6Y", "https://lh3.googleusercontent.com/d/16UZpgeLycuBegTtI-bSJEFsh9rCvVluT"] },
      { name: "Cassie Natural 20-in Table Lamp", link: "https://amzn.to/4v82wWl", images: ["https://lh3.googleusercontent.com/d/1Up_xlxmXoHbK2zfA7aTOHMzXGHh9vLbl", "https://lh3.googleusercontent.com/d/1w7ItB74B6X7djC1eq6nnNbqKh37XhNUu"] },
      { name: "Akari Rice Paper Lamp", link: "https://amzn.to/4gi9kNH", images: ["https://lh3.googleusercontent.com/d/19Hmz0Rnio3Dr4OTD5J5zD3bOvOPaWRWs", "https://lh3.googleusercontent.com/d/11f9_tXAWkN0VhAvn57sXjD5Z0zbGt8-d", "https://lh3.googleusercontent.com/d/1uvt_ylZyhYbkO-uErK3JiLoaPfvi-PS-"] },
      { name: "Earthtone Ceramic Table Lamp", link: "https://amzn.to/4eOhUkz", images: ["https://lh3.googleusercontent.com/d/1SJKyv3ifNqRB3To-kHOm9fOqRMbYVLmy"] },
    ],
    Pendants: [
      { name: "Akari 21A Washi Paper Ceiling Lamp", link: "https://amzn.to/3SSbGsF", images: ["https://lh3.googleusercontent.com/d/1OpNOiD_HZqbakzrqHH47tvPOzOR6ayM0", "https://lh3.googleusercontent.com/d/1Ks7SHdMpJEQw7rFQ4F6ReAovc5SCB3_R"] },
      { name: "Akari Style Long Pendant Light", link: "https://amzn.to/4vFwKRV", images: ["https://lh3.googleusercontent.com/d/1OMRGgE-rwILINSLbVddFoSZsDJ8sgC4-", "https://lh3.googleusercontent.com/d/1uZVHD8ob1a8VyLLWP7HGTl0_iaMKSTM8", "https://lh3.googleusercontent.com/d/1e0raLIYQyTGj2OMzAnBbC3djXDbDYjxS"] },
    ],
  },
};

export const profileMap: Record<string, { title: string; sub: string }> = {
  Japandi: { title: "The Japandi Purist", sub: "A considered interior where Japanese restraint meets Scandinavian warmth" },
  "Wabi-Sabi": { title: "The Wabi-Sabi Edit", sub: "An interior that finds beauty in imperfection and the passage of time" },
  "Organic Modern": { title: "The Organic Modernist", sub: "Clean architecture softened by natural material and honest texture" },
  "Quiet Luxury": { title: "The Quiet Luxurist", sub: "A refined interior where quality speaks louder than decoration" },
};

export function getMaterialProducts(material: string, room: string): ProductGroup {
  if (material.toLowerCase().includes("walnut")) return room === "Dining Room" ? catalog.walnutDining : catalog.walnut;
  if (material.toLowerCase().includes("oak")) return room === "Dining Room" ? catalog.oakDining : catalog.oak;
  return catalog.walnut;
}

// Returns a complementary design edit — hero piece in chosen material,
// supporting pieces in contrasting tones so the room doesn't wash out.
export function getEditCatalog(material: string, room: string, priority: string): ProductGroup {
  const isLighting = priority && priority.toLowerCase().includes("lighting");
  const isDining = room === "Dining Room";
  const isWalnut = material && material.toLowerCase().includes("walnut");
  const isOak = material && material.toLowerCase().includes("oak");

  if (isLighting) return catalog.light;
  if (isDining) return isWalnut ? catalog.walnutDining : catalog.oakDining;

  if (isWalnut)
    return {
      "Coffee Tables": catalog.walnut["Coffee Tables"],
      "Side Tables": catalog.oak["Side Tables"],
      Seating: catalog.walnut["Seating"],
      "Table Lamps": catalog.light["Table Lamps"],
    };

  if (isOak)
    return {
      "Coffee Tables": catalog.oak["Coffee Tables"],
      "Side Tables": catalog.walnut["Side Tables"],
      Seating: catalog.oak["Seating"],
      "Table Lamps": catalog.light["Table Lamps"],
    };

  return getMaterialProducts(material, room);
}
